// Motor de simplificación: aplica leyes en orden hasta condición de parada.
import { normalize, equal } from './arbol.js';

export class SimplificadorBooleano {
  constructor(leyes) {
    this.leyes = leyes || [];
    this.pasos = [];
  }

  reiniciar() { this.pasos = []; }

  paso(ast) {
    for (const ley of this.leyes) {
      const antes = normalize(ast);
      const r = ley.apply(antes) || { changed: false, ast: antes };
      const despues = normalize(r.ast);
      if (!equal(antes, despues)) {
        this.pasos.push({ before: antes, law: ley.name, after: despues });
        return { changed: true, ast: despues };
      }
    }
    return { changed: false, ast };
  }

  simplificar(ast) {
    let previo = null;
    let actual = normalize(ast);
    do {
      previo = actual;
      const r = this.paso(actual);
      actual = r.ast;
    } while (!equal(previo, actual));
    return actual;
  }
}


