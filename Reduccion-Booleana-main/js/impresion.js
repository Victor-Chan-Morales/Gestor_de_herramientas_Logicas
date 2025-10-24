import { isNode } from './arbol.js';

export function imprimir(node) {
  if (!isNode(node)) return String(node);
  const op = node[0];
  if (op === 'NOT') return `!${envolver(node[1], op)}`;
  if (op === 'AND') return node.slice(1).map(n => envolver(n, op)).join(' * ');
  if (op === 'OR')  return node.slice(1).map(n => envolver(n, op)).join(' + ');
  return String(node);
}

function envolver(node, parentOp) {
  if (!isNode(node)) return String(node);
  const prec = { NOT: 3, AND: 2, OR: 1 };
  const need = prec[node[0]] < prec[parentOp];
  const inner = imprimir(node);
  return need ? `(${inner})` : inner;
}


