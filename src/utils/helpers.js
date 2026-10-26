import { FRANJAS_HORARIAS, PROFESIONALES } from '../data/constants'

const ALFABETO_CODIGO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sin 0/O/1/I para evitar confusiones

export function generarCodigoTurno() {
  let codigo = ''
  for (let i = 0; i < 6; i++) {
    codigo += ALFABETO_CODIGO[Math.floor(Math.random() * ALFABETO_CODIGO.length)]
  }
  return codigo
}

export function formatearFecha(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function proximosDiasHabiles(cantidad = 10, desde = new Date()) {
  const dias = []
  const cursor = new Date(desde)
  cursor.setHours(0, 0, 0, 0)

  while (dias.length < cantidad) {
    const diaSemana = cursor.getDay() // 0 = domingo, 6 = sábado
    if (diaSemana !== 0 && diaSemana !== 6) {
      dias.push({
        fecha: formatearFecha(cursor),
        label: cursor.toLocaleDateString('es-AR', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }),
      })
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return dias
}

function horarioAMinutos(horario) {
  const [h, m] = horario.split(':').map(Number)
  return h * 60 + m
}

function seSuperponen(inicioA, duracionA, inicioB, duracionB) {
  const finA = inicioA + duracionA
  const finB = inicioB + duracionB
  return inicioA < finB && inicioB < finA
}

/**
 * Horarios libres de un profesional puntual en una fecha, considerando
 * los turnos ya tomados y los bloqueos cargados desde el panel.
 */
export function horariosLibresDeProfesional({
  profesionalId,
  fecha,
  duracionServicio,
  turnos,
  bloqueos,
}) {
  const bloqueosDelDia = bloqueos.filter(
    (b) => b.fecha === fecha && (b.profesional === profesionalId || b.profesional === 'all')
  )
  if (bloqueosDelDia.some((b) => b.diaCompleto)) return []

  const turnosDelProfesional = turnos.filter(
    (t) => t.profesional === profesionalId && t.fecha === fecha && t.estado !== 'cancelado'
  )

  return FRANJAS_HORARIAS.filter((horario) => {
    const inicio = horarioAMinutos(horario)

    const chocaConTurno = turnosDelProfesional.some((t) =>
      seSuperponen(inicio, duracionServicio, horarioAMinutos(t.hora), t.duracion || 30)
    )
    if (chocaConTurno) return false

    const chocaConBloqueo = bloqueosDelDia.some(
      (b) => !b.diaCompleto && seSuperponen(inicio, duracionServicio, horarioAMinutos(b.hora), b.duracion || 30)
    )
    if (chocaConBloqueo) return false

    return true
  })
}

/**
 * Horarios libres cuando el paciente elige "el primero disponible":
 * unión de los horarios libres de todos los profesionales.
 */
export function horariosLibresPrimerDisponible({ fecha, duracionServicio, turnos, bloqueos }) {
  const horariosPorProfesional = PROFESIONALES.map((p) =>
    horariosLibresDeProfesional({
      profesionalId: p.id,
      fecha,
      duracionServicio,
      turnos,
      bloqueos,
    })
  )

  const union = new Set()
  horariosPorProfesional.forEach((horarios) => horarios.forEach((h) => union.add(h)))

  return FRANJAS_HORARIAS.filter((h) => union.has(h))
}

/**
 * Cuando el paciente eligió "el primero disponible", resuelve a qué
 * profesional real asignarle el turno en ese horario y fecha.
 */
export function resolverProfesionalDisponible({ fecha, hora, duracionServicio, turnos, bloqueos }) {
  const disponible = PROFESIONALES.find((p) => {
    const libres = horariosLibresDeProfesional({
      profesionalId: p.id,
      fecha,
      duracionServicio,
      turnos,
      bloqueos,
    })
    return libres.includes(hora)
  })
  return disponible ?? null
}

export function sumarDias(fecha, dias) {
  const [y, m, d] = fecha.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + dias)
  return formatearFecha(date)
}

export function nombreDiaLargo(fecha) {
  const [y, m, d] = fecha.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const texto = date.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

/**
 * Matriz de semanas (lunes a domingo) para el mini calendario del panel.
 * Cada celda es la fecha 'YYYY-MM-DD' o null si pertenece a otro mes.
 */
export function matrizDelMes(anio, mes) {
  const primerDia = new Date(anio, mes, 1)
  const ultimoDia = new Date(anio, mes + 1, 0)

  // 0=domingo..6=sábado -> lo convertimos a 0=lunes..6=domingo
  const offsetInicio = (primerDia.getDay() + 6) % 7

  const celdas = []
  for (let i = 0; i < offsetInicio; i++) celdas.push(null)
  for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
    celdas.push(formatearFecha(new Date(anio, mes, dia)))
  }
  while (celdas.length % 7 !== 0) celdas.push(null)

  const semanas = []
  for (let i = 0; i < celdas.length; i += 7) semanas.push(celdas.slice(i, i + 7))
  return semanas
}
