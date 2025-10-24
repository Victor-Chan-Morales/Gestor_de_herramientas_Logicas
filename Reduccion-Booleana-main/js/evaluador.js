// Evaluador de expresiones booleanas
export function evaluar(ast, valores) {
  if (typeof ast === 'string') {
    // Si es una variable (A, B, C, etc.)
    if (/[A-Z]/.test(ast)) {
      if (valores[ast] === undefined) {
        throw new Error(`Valor no definido para la variable ${ast}`);
      }
      return valores[ast];
    }
    // Si es una constante (0 o 1)
    return ast === '1';
  }

  // Es un array que representa una operación
  const [op, ...args] = ast;
  
  switch (op) {
    case 'AND':
      return evaluar(args[0], valores) && evaluar(args[1], valores);
    case 'OR':
      return evaluar(args[0], valores) || evaluar(args[1], valores);
    case 'NOT':
      return !evaluar(args[0], valores);
    default:
      throw new Error(`Operador desconocido: ${op}`);
  }
}