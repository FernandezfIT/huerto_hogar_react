/*
  formatCurrency centraliza el formato de moneda de la tienda.

  Se usa Intl en vez de concatenar "$" a mano para que los miles
  queden con separador ($12.000) y no dependa de cada componente.
*/

const CLP_FORMATTER = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

export function formatCurrency(value) {
  const amount = Number(value)

  // Cualquier valor no numérico se trata como 0 para no romper el render.
  return CLP_FORMATTER.format(Number.isFinite(amount) ? amount : 0)
}