// Utilidades de Árbol de Sintaxis (AST) para expresiones booleanas

export const OP_OR = 'OR';
export const OP_AND = 'AND';
export const OP_NOT = 'NOT';

export function isNode(value) {
  return Array.isArray(value) && typeof value[0] === 'string';
}

export function isOr(node) {
  return isNode(node) && node[0] === OP_OR;
}

export function isAnd(node) {
  return isNode(node) && node[0] === OP_AND;
}

export function isNot(node) {
  return isNode(node) && node[0] === OP_NOT;
}

export function isConst(node) {
  return node === '1' || node === '0';
}

export function isSymbol(node) {
  return typeof node === 'string' && !isConst(node) && !['OR','AND','NOT'].includes(node);
}

export function clone(node) {
  if (!isNode(node)) return node;
  return [node[0], ...node.slice(1).map(clone)];
}

export function equal(a, b) {
  if (a === b) return true;
  if (isNode(a) && isNode(b)) {
    if (a[0] !== b[0] || a.length !== b.length) return false;
    for (let i = 1; i < a.length; i++) {
      if (!equal(a[i], b[i])) return false;
    }
    return true;
  }
  return false;
}

export function toKey(node) {
  if (!isNode(node)) return String(node);
  return `${node[0]}(${node.slice(1).map(toKey).join(',')})`;
}

export function flatten(node) {
  if (!isNode(node)) return node;
  if (isOr(node)) {
    const items = [];
    node.slice(1).forEach((c) => {
      const fc = flatten(c);
      if (isOr(fc)) items.push(...fc.slice(1)); else items.push(fc);
    });
    return [OP_OR, ...items];
  }
  if (isAnd(node)) {
    const items = [];
    node.slice(1).forEach((c) => {
      const fc = flatten(c);
      if (isAnd(fc)) items.push(...fc.slice(1)); else items.push(fc);
    });
    return [OP_AND, ...items];
  }
  if (isNot(node)) return [OP_NOT, flatten(node[1])];
  return node;
}

export function normalize(node) {
  // Aplana y ordena operandos para obtener una forma canónica
  const f = flatten(node);
  if (isOr(f) || isAnd(f)) {
    const op = f[0];
    const items = f.slice(1).map(normalize);
    items.sort((a, b) => toKey(a).localeCompare(toKey(b)));
    return [op, ...items];
  }
  if (isNot(f)) return [OP_NOT, normalize(f[1])];
  return f;
}

export function containsTerm(haystack, needle) {
  if (!isNode(haystack)) return false;
  return haystack.slice(1).some((t) => equal(t, needle));
}

export function isNegationOf(a, b) {
  return (
    (isNot(a) && equal(a[1], b)) ||
    (isNot(b) && equal(b[1], a))
  );
}


