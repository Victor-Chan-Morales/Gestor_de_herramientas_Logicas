import { analizar } from './analizador.js';
import { LEYES_POR_DEFECTO } from './leyes.js';
import { SimplificadorBooleano } from './simplificador.js';
import { imprimir } from './impresion.js';
import { evaluar } from './evaluador.js';

let stepsEl, resultEl, inputEl, errorsEl;
const simplifier = new SimplificadorBooleano(LEYES_POR_DEFECTO);

function renderSteps(steps) {
  stepsEl.innerHTML = '';
  steps.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'step';
    div.innerHTML = `
      <div><strong>Paso ${i + 1}</strong></div>
      <div class="expr">Antes: ${formatExpr(s.before)}</div>
      <div class="law">Ley: ${s.law}</div>
      <div class="expr">Después: ${formatExpr(s.after)}</div>
    `;
    stepsEl.appendChild(div);
  });
}

function formatExpr(ast) { return imprimir(ast); }

function onEnterExpression() {
  inputEl && inputEl.focus();
}

function onStepSimplify() {
  try {
    errorsEl && (errorsEl.textContent = '');
    const ast = analizar(inputEl.value);
    simplifier.reiniciar();
    const res = simplifier.paso(ast);
    renderSteps(simplifier.pasos);
    resultEl.textContent = formatExpr(res.ast);
  } catch (e) {
    if (errorsEl) errorsEl.textContent = e.message || 'Error al procesar la expresión'; else alert(e.message || 'Error al procesar la expresión');
  }
}

function onFinalSimplify() {
  try {
    errorsEl && (errorsEl.textContent = '');
    const ast = analizar(inputEl.value);
    simplifier.reiniciar();
    const res = simplifier.simplificar(ast);
    renderSteps(simplifier.pasos);
    resultEl.textContent = formatExpr(res);
    
    // Evaluar la expresión para algunos casos de prueba
    const variables = new Set();
    JSON.stringify(res).replace(/[A-Z]/g, v => variables.add(v));
    
    if (variables.size > 0) {
      const tabla = document.createElement('div');
      tabla.className = 'truth-table';
      let html = '<h3>Tabla de Verdad</h3><table><tr><th>' + 
                 Array.from(variables).join('</th><th>') + 
                 '</th><th>Resultado</th></tr>';
      
      // Generar todas las combinaciones posibles
      const combinations = 1 << variables.size;
      for (let i = 0; i < combinations; i++) {
        const valores = {};
        let j = 0;
        variables.forEach(v => {
          valores[v] = (i & (1 << j++)) !== 0;
        });
        
        html += '<tr><td>' + Array.from(variables).map(v => valores[v] ? '1' : '0').join('</td><td>') +
                '</td><td>' + (evaluar(res, valores) ? '1' : '0') + '</td></tr>';
      }
      
      html += '</table>';
      tabla.innerHTML = html;
      resultEl.appendChild(tabla);
    }
  } catch (e) {
    if (errorsEl) errorsEl.textContent = e.message || 'Error al procesar la expresión'; else alert(e.message || 'Error al procesar la expresión');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  stepsEl = document.getElementById('steps');
  resultEl = document.getElementById('result');
  inputEl = document.getElementById('expression');
  errorsEl = document.getElementById('errors');

  document.getElementById('btn-enter').addEventListener('click', onEnterExpression);
  document.getElementById('btn-final').addEventListener('click', onFinalSimplify);

  // Enter para simplificar
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') onFinalSimplify();
  });

  // Demo inicial
  onFinalSimplify();
});


