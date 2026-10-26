export const CLINIC_NAME = 'Clínica Dental Aurora'

// Reemplazar por los servicios reales de la clínica.
// `tag` referencia un color pastel definido en tailwind.config.js (colors.tag)
// usado para identificar el servicio en la agenda del panel.
export const SERVICIOS = [
  { id: 'consulta-general', nombre: 'Consulta general', duracion: 30, tag: 'sand' },
  { id: 'ortodoncia', nombre: 'Ortodoncia', duracion: 30, tag: 'sky' },
  { id: 'blanqueamiento', nombre: 'Blanqueamiento', duracion: 45, tag: 'blush' },
  { id: 'limpieza', nombre: 'Limpieza dental', duracion: 30, tag: 'clover' },
  { id: 'endodoncia', nombre: 'Endodoncia', duracion: 60, tag: 'rose' },
  { id: 'urgencia', nombre: 'Urgencia', duracion: 30, tag: 'lilac' },
]

// Reemplazar por las prepagas reales que acepta la clínica.
export const PREPAGAS = [
  { id: 'osde', nombre: 'OSDE' },
  { id: 'swiss-medical', nombre: 'Swiss Medical' },
  { id: 'galeno', nombre: 'Galeno' },
  { id: 'ioma', nombre: 'IOMA' },
  { id: 'particular', nombre: 'Particular / sin cobertura' },
]

// Reemplazar por los profesionales reales de la clínica.
export const PROFESIONALES = [
  { id: 'quiroga', nombre: 'Federico Quiroga', especialidad: 'Odontología general' },
  { id: 'ventimiglia', nombre: 'Paula Ventimiglia', especialidad: 'Ortodoncia' },
  { id: 'delvalle', nombre: 'Sofía Del Valle', especialidad: 'Endodoncia' },
]

// Franjas de 30 minutos ofrecidas al público para sacar un turno.
export const FRANJAS_HORARIAS = [
  ...rangoHorarios(9, 12),
  ...rangoHorarios(14, 18),
]

function rangoHorarios(desde, hasta) {
  const horarios = []
  for (let h = desde; h < hasta; h++) {
    horarios.push(`${String(h).padStart(2, '0')}:00`)
    horarios.push(`${String(h).padStart(2, '0')}:30`)
  }
  return horarios
}

export function getServicio(id) {
  return SERVICIOS.find((s) => s.id === id)
}

export function getServicioPorNombre(nombre) {
  return SERVICIOS.find((s) => s.nombre === nombre)
}

// Debe reflejar los mismos valores que colors.tag en tailwind.config.js.
// Se usa como estilo inline en la agenda porque el color depende de datos
// (el servicio del turno), y Tailwind no puede generar esas clases en build time.
export const TAG_HEX = {
  sand: '#EFE0C3',
  rose: '#F1D3D8',
  sage: '#D8E4D0',
  sky: '#D6E2EA',
  lilac: '#E2DCEE',
  clover: '#DCE7CE',
  blush: '#F3DCE4',
}

export function getPrepaga(id) {
  return PREPAGAS.find((p) => p.id === id)
}

export function getProfesional(id) {
  return PROFESIONALES.find((p) => p.id === id)
}
