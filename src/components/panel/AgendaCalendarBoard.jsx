import { PROFESIONALES, SERVICIOS, TAG_HEX, getServicioPorNombre } from '../../data/constants'

const DAY_START_MIN = 8 * 60
const DAY_END_MIN = 20 * 60
const PX_PER_MIN = 1.15
const BOARD_HEIGHT = (DAY_END_MIN - DAY_START_MIN) * PX_PER_MIN

function minutosDesdeHora(hora) {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

function horasDeMarca() {
  const horas = []
  for (let h = DAY_START_MIN / 60; h <= DAY_END_MIN / 60; h++) {
    horas.push(h)
  }
  return horas
}

export default function AgendaCalendarBoard({ turnosDelDia }) {
  const porProfesional = PROFESIONALES.map((p) => ({
    profesional: p,
    turnos: turnosDelDia.filter((t) => t.profesional === p.id),
  }))

  return (
    <div className="bg-white border border-forest-100 rounded-xl overflow-hidden">
      <Leyenda />

      <div className="overflow-x-auto">
        <div className="flex" style={{ minWidth: 160 + porProfesional.length * 220 }}>
          <div className="w-[160px] shrink-0 border-r border-cream-200">
            <div className="h-14 border-b border-cream-200" />
            <div style={{ height: BOARD_HEIGHT }} className="relative">
              {horasDeMarca().map((h) => (
                <div
                  key={h}
                  className="absolute left-0 right-0 text-xs text-ink-500/70 pr-3 text-right -translate-y-1/2"
                  style={{ top: (h * 60 - DAY_START_MIN) * PX_PER_MIN }}
                >
                  {String(h).padStart(2, '0')}:00
                </div>
              ))}
            </div>
          </div>

          {porProfesional.map(({ profesional, turnos }) => (
            <div key={profesional.id} className="w-[220px] shrink-0 border-r border-cream-200 last:border-r-0">
              <div className="h-14 border-b border-cream-200 px-3 flex flex-col justify-center">
                <p className="text-sm font-medium text-ink-900 truncate">{profesional.nombre}</p>
                <p className="text-[11px] text-ink-500/70">{turnos.length} turnos</p>
              </div>

              <div className="relative" style={{ height: BOARD_HEIGHT }}>
                {horasDeMarca().map((h) => (
                  <div
                    key={h}
                    className="absolute left-0 right-0 border-t border-cream-200/80"
                    style={{ top: (h * 60 - DAY_START_MIN) * PX_PER_MIN }}
                  />
                ))}

                {turnos.map((turno) => (
                  <TurnoBloque key={turno.id} turno={turno} />
                ))}
              </div>
            </div>
          ))}

          {porProfesional.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-sm text-ink-500 py-16">
              No hay profesionales cargados.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TurnoBloque({ turno }) {
  const servicio = getServicioPorNombre(turno.servicio)
  const color = TAG_HEX[servicio?.tag ?? 'sand']
  const cancelado = turno.estado === 'cancelado'

  const inicio = minutosDesdeHora(turno.hora)
  const duracion = turno.duracion || 30
  const top = (inicio - DAY_START_MIN) * PX_PER_MIN
  const height = Math.max(duracion * PX_PER_MIN - 3, 20)

  return (
    <div
      className={`absolute left-1 right-1 rounded-md px-2 py-1 overflow-hidden border ${
        cancelado ? 'opacity-45 border-dashed' : 'border-black/5'
      }`}
      style={{ top, height, backgroundColor: cancelado ? '#EFEBE4' : color }}
      title={`${turno.hora} · ${turno.nombre} · ${turno.servicio}${cancelado ? ' (cancelado)' : ''}`}
    >
      <p className={`text-[11px] font-semibold text-ink-900 leading-tight truncate ${cancelado ? 'line-through' : ''}`}>
        {turno.hora} {turno.nombre}
      </p>
      <p className="text-[10px] text-ink-700/70 leading-tight truncate">{turno.servicio}</p>
    </div>
  )
}

function Leyenda() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 px-4 py-3 border-b border-cream-200 bg-cream-50/60">
      {SERVICIOS.map((s) => (
        <span key={s.id} className="inline-flex items-center gap-1.5 text-xs text-ink-500">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: TAG_HEX[s.tag] }}
          />
          {s.nombre}
        </span>
      ))}
    </div>
  )
}
