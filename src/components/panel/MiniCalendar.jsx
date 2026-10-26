import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { matrizDelMes, formatearFecha } from '../../utils/helpers'

const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export default function MiniCalendar({ fechaSeleccionada, onSeleccionar }) {
  const inicial = new Date(`${fechaSeleccionada}T00:00:00`)
  const [anio, setAnio] = useState(inicial.getFullYear())
  const [mes, setMes] = useState(inicial.getMonth())

  const semanas = matrizDelMes(anio, mes)
  const hoy = formatearFecha(new Date())

  function cambiarMes(delta) {
    let nuevoMes = mes + delta
    let nuevoAnio = anio
    if (nuevoMes < 0) {
      nuevoMes = 11
      nuevoAnio -= 1
    } else if (nuevoMes > 11) {
      nuevoMes = 0
      nuevoAnio += 1
    }
    setMes(nuevoMes)
    setAnio(nuevoAnio)
  }

  return (
    <div className="bg-white border border-forest-100 rounded-xl p-4 w-64 shrink-0">
      <div className="flex items-center justify-between mb-3">
        <p className="font-medium text-sm text-ink-900">
          {MESES[mes]} {anio}
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => cambiarMes(-1)}
            className="p-1 rounded hover:bg-cream-200 text-ink-500"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => cambiarMes(1)}
            className="p-1 rounded hover:bg-cream-200 text-ink-500"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {DIAS.map((d, i) => (
          <span key={i} className="text-[11px] text-ink-500/60 font-medium">
            {d}
          </span>
        ))}

        {semanas.flat().map((fecha, i) => {
          if (!fecha) return <span key={i} />
          const esHoy = fecha === hoy
          const esSeleccionado = fecha === fechaSeleccionada
          return (
            <button
              key={i}
              onClick={() => onSeleccionar(fecha)}
              className={`text-xs w-7 h-7 mx-auto rounded-full flex items-center justify-center transition-colors ${
                esSeleccionado
                  ? 'bg-forest-600 text-white font-medium'
                  : esHoy
                    ? 'text-forest-600 font-semibold'
                    : 'text-ink-700 hover:bg-cream-200'
              }`}
            >
              {Number(fecha.split('-')[2])}
            </button>
          )
        })}
      </div>
    </div>
  )
}
