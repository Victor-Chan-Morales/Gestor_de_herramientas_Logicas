// Analizador (parser) con precedencia: ! > * > +

export function validar(expresion) {
  const errores = [];
  if (typeof expresion !== 'string' || expresion.trim() === '') {
    errores.push('La expresión no puede estar vacía.');
  }
  const permitidos = /^[A-Za-z0-9+*!() \t\r\n]+$/;
  if (!permitidos.test(expresion)) {
    errores.push('Símbolos inválidos. Usa letras, +, *, ! y paréntesis ().');
  }
  let balance = 0;
  for (let i = 0; i < expresion.length; i++) {
    const ch = expresion[i];
    if (ch === '(') balance += 1;
    if (ch === ')') balance -= 1;
    if (balance < 0) { errores.push('Paréntesis desbalanceados.'); break; }
  }
  if (balance !== 0) errores.push('Paréntesis desbalanceados.');
  if (errores.length) { const err = new Error(errores.join(' ')); err.errors = errores; throw err; }
}

function tokenizar(src) {
  const tokens = [];
  const s = src.replace(/\s+/g, '');
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (/[A-Za-z]/.test(ch)) tokens.push({ type: 'SYMBOL', value: ch });
    else if (ch === '+') tokens.push({ type: 'OR' });
    else if (ch === '*') tokens.push({ type: 'AND' });
    else if (ch === '!') tokens.push({ type: 'NOT' });
    else if (ch === '(') tokens.push({ type: 'LPAREN' });
    else if (ch === ')') tokens.push({ type: 'RPAREN' });
    else if (ch === '1' || ch === '0') tokens.push({ type: 'CONST', value: ch });
    else throw new Error(`Símbolo inesperado: ${ch}`);
  }
  return tokens;
}

export function analizar(expresion) {
  const normalizada = expresion.replace(/[a-z]/g, c => c.toUpperCase());
  validar(normalizada);
  const tokens = tokenizar(normalizada);
  let i = 0;
  const ver = () => tokens[i];
  const tomar = () => tokens[i++];

  function parseExpr() {
    let node = parseTerm();
    while (ver() && ver().type === 'OR') { tomar(); node = ['OR', node, parseTerm()]; }
    return node;
  }
  function parseTerm() {
    let node = parseFactor();
    while (true) {
      if (ver() && ver().type === 'AND') { tomar(); node = ['AND', node, parseFactor()]; continue; }
      const t = ver();
      if (t && (t.type === 'SYMBOL' || t.type === 'CONST' || t.type === 'NOT' || t.type === 'LPAREN')) {
        node = ['AND', node, parseFactor()]; continue;
      }
      break;
    }
    return node;
  }
  function parseFactor() {
    const t = ver();
    if (!t) throw new Error('Expresión incompleta');
    if (t.type === 'NOT') { tomar(); return ['NOT', parseFactor()]; }
    if (t.type === 'SYMBOL') { tomar(); return t.value; }
    if (t.type === 'CONST') { tomar(); return t.value; }
    if (t.type === 'LPAREN') { tomar(); const node = parseExpr(); if (!ver() || ver().type !== 'RPAREN') throw new Error('Falta )'); tomar(); return node; }
    throw new Error('Token inesperado en factor');
  }

  const ast = parseExpr();
  if (i !== tokens.length) throw new Error('Tokens restantes no consumidos');
  return ast;
}


