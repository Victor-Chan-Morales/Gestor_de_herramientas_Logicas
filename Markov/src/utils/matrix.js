import { create, all } from 'mathjs'
const math = create(all)

export function powerMatrix(P, n) {
  if (n === 0) {
    return P.map((r, i) => r.map((_, j) => (i === j ? 1 : 0)))
  }
  const m = math.matrix(P)
  const Pn = math.pow(m, n)
  return Pn.toArray()
}

// ahora espera pi0 como array plano [p1,p2,...] y Pn como matriz
export function multiplyPiByP(pi0, Pn) {
  // aseguramos que pi0 sea fila
  const piVec = math.matrix([pi0])
  const res = math.multiply(piVec, math.matrix(Pn))
  const arr = res.toArray()
  // res es una matriz 1 x n -> devolver la primera fila
  return Array.isArray(arr[0]) ? arr[0] : arr
}

export function validateRows(P, eps = 1e-6) {
  for (let i = 0; i < P.length; i++) {
    const sum = P[i].reduce((a, b) => a + Number(b), 0)
    if (Math.abs(sum - 1) > eps) return { ok: false, row: i, sum }
  }
  return { ok: true }
}
