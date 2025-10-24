// Conjunto de leyes (sin distributiva ni asociativa) con nombres en español
import { OP_OR, OP_AND, OP_NOT, isNode, isOr, isAnd, isNot, isConst, isSymbol, equal, normalize, isNegationOf } from './arbol.js';

function deMorgan(node) {
  if (!isNode(node)) return { changed: false, ast: node };
  if (isNot(node)) {
    const inner = node[1];
    if (isAnd(inner)) return { changed: true, ast: normalize([OP_OR, ...inner.slice(1).map(t => [OP_NOT, t])]) };
    if (isOr(inner))  return { changed: true, ast: normalize([OP_AND, ...inner.slice(1).map(t => [OP_NOT, t])]) };
  }
  if (isOr(node) || isAnd(node)) {
    const op = node[0];
    const children = node.slice(1).map(n => deMorgan(n).ast);
    return { changed: false, ast: normalize([op, ...children]) };
  }
  return { changed: false, ast: node };
}

function idempotencia(node) {
  if (!isNode(node)) return { changed: false, ast: node };
  if (isOr(node) || isAnd(node)) {
    const op = node[0];
    const uniq = [];
    node.slice(1).forEach((t) => { if (!uniq.some(u => equal(u, t))) uniq.push(t); });
    if (uniq.length !== node.length - 1) return { changed: true, ast: normalize([op, ...uniq]) };
  }
  return { changed: false, ast: node };
}

function complemento(node) {
  if (!isNode(node)) return { changed: false, ast: node };
  if (isOr(node) || isAnd(node)) {
    const op = node[0];
    const terms = node.slice(1);
    for (let i = 0; i < terms.length; i++) {
      for (let j = i + 1; j < terms.length; j++) {
        if (isNegationOf(terms[i], terms[j])) return op === OP_OR ? { changed: true, ast: '1' } : { changed: true, ast: '0' };
      }
    }
  }
  if (isNode(node)) {
    const op = node[0];
    const children = node.slice(1).map(n => complemento(n).ast);
    return { changed: false, ast: normalize([op, ...children]) };
  }
  return { changed: false, ast: node };
}

function identidad(node) {
  if (!isNode(node)) return { changed: false, ast: node };
  if (isNot(node) && isConst(node[1])) return { changed: true, ast: node[1] === '0' ? '1' : '0' };
  if (isOr(node) || isAnd(node)) {
    const op = node[0];
    const parts = node.slice(1);
    if (op === OP_OR && parts.some(p => p === '1')) return { changed: true, ast: '1' };
    if (op === OP_AND && parts.some(p => p === '0')) return { changed: true, ast: '0' };
    const filtered = parts.filter(p => !(op === OP_OR && p === '0') && !(op === OP_AND && p === '1'));
    if (filtered.length !== parts.length) return { changed: true, ast: normalize([op, ...filtered]) };
  }
  if (isNode(node)) {
    const op = node[0];
    const children = node.slice(1).map(n => identidad(n).ast);
    return { changed: false, ast: normalize([op, ...children]) };
  }
  return { changed: false, ast: node };
}

function absorcion(node) {
  if (!isNode(node)) return { changed: false, ast: node };
  if (isOr(node)) {
    const terms = node.slice(1);
    for (let i = 0; i < terms.length; i++) {
      for (let j = 0; j < terms.length; j++) {
        if (i === j) continue;
        const Ti = terms[i];
        const Tj = terms[j];
        if (isAnd(Tj) && Tj.slice(1).some(t => equal(t, Ti))) return { changed: true, ast: normalize(['OR', ...terms.filter((_, k) => k !== j)]) };
      }
    }
  }
  if (isAnd(node)) {
    const terms = node.slice(1);
    for (let i = 0; i < terms.length; i++) {
      for (let j = 0; j < terms.length; j++) {
        if (i === j) continue;
        const Ti = terms[i];
        const Tj = terms[j];
        if (isOr(Tj) && Tj.slice(1).some(t => equal(t, Ti))) return { changed: true, ast: normalize(['AND', ...terms.filter((_, k) => k !== j)]) };
      }
    }
  }
  if (isNode(node)) {
    const op = node[0];
    const children = node.slice(1).map(n => absorcion(n).ast);
    return { changed: false, ast: normalize([op, ...children]) };
  }
  return { changed: false, ast: node };
}

function factorizacion(node) {
  if (!isOr(node)) return { changed: false, ast: node };
  const terms = node.slice(1);
  if (terms.length < 2) return { changed: false, ast: node };
  const factorsOf = (t) => (isAnd(t) ? t.slice(1) : [t]);
  const baseFactors = factorsOf(terms[0]);
  for (const candidate of baseFactors) {
    let isCommon = true;
    for (let i = 1; i < terms.length; i++) {
      const fi = factorsOf(terms[i]);
      if (!fi.some(f => equal(f, candidate))) { isCommon = false; break; }
    }
    if (isCommon) {
      const remainders = terms.map((t) => {
        const fi = factorsOf(t);
        const rest = fi.filter(f => !equal(f, candidate));
        if (rest.length === 0) return '1';
        if (rest.length === 1) return rest[0];
        return [OP_AND, ...rest];
      });
      const ast = normalize([OP_AND, candidate, [OP_OR, ...remainders]]);
      return { changed: true, ast };
    }
  }
  return { changed: false, ast: node };
}

export const LEYES_POR_DEFECTO = [
  { name: 'DE_MORGAN', apply: deMorgan },
  { name: 'FACTORIZACIÓN', apply: factorizacion },
  { name: 'COMPLEMENTO', apply: complemento },
  { name: 'IDENTIDAD', apply: identidad },
  { name: 'ABSORCIÓN', apply: absorcion },
  { name: 'IDEMPOTENCIA', apply: idempotencia },
];


