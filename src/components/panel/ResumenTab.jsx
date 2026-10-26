import { useMemo } from 'react'
import { CalendarClock, PieChart, Users2 } from 'lucide-react'
import { PROFESIONALES, FRANJAS_HORARIAS, getProfesional } from '../../data/constants'
import { formatearFecha } from '../../utils/helpers'

export default function ResumenTab({ appointmentsState, onIrAAgenda }) {
  const { appointments, loading } = appointmentsState
  const hoy = formatearFecha(new Date())

  const activos = useMemo(() => appointments.filter((a) => a.estado !== 'cancelado'), [appointments])

  const deHoy = useMemo(() => activos.filter((a) => a.fecha === hoy), [activos, hoy])

  const ocupacion = useMemo(() => {
    const capacidadTotal = PROFESIONALES.length * FRANJAS_HORARIAS.length
    if (capacidadTotal === 0) return 0
    return Math.round((deHoy.length / capacidadTotal) * 100)
  }, [deHoy])

  const proximos = useMemo(() => {
    const ahora = new Date()
    return activos
      .filter((a) => new Date(`${a.fecha}T${a.hora}`) >= ahora)
      .sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`))
      .slice(0, 5)
  }, [activos])

  if (loading) {
    return <p className="p-8 text-sm text-ink-500">Cargando resumen...</p>
  }

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl text-ink-900 mb-6">Resumen</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Metrica icono={CalendarClock} etiqueta="Turnos activos" valor={activos.length} />
        <Metrica icono={Users2} etiqueta="Turnos de hoy" valor={deHoy.length} />
        <Metrica icono={PieChart} etiqueta="Ocupación de hoy" valor={`${ocupacion}%`} />
      </div>

      <div className="bg-white border border-forest-100 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-ink-900">Próximos turnos</h2>
          <button onClick={onIrAAgenda} className="text-sm text-forest-600 hover:text-forest-700 font-medium">
            Ver agenda completa
          </button>
        </div>

        {proximos.length === 0 ? (
          <p className="text-sm text-ink-500 py-6 text-center">No hay turnos próximos.</p>
        ) : (
          <ul className="grid gap-2.5">
            {proximos.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-cream-50 text-sm"
              >
                <div>
                  <p className="font-medium text-ink-900">{t.nombre}</p>
                  <p className="text-ink-500 text-xs">
                    {t.servicio} · {getProfesional(t.profesional)?.nombre ?? t.profesional}
                  </p>
                </div>
                <div className="text-right text-ink-700">
                  <p className="font-medium">{t.hora}</p>
                  <p className="text-xs text-ink-500">{t.fecha}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function Metrica({ icono: Icono, etiqueta, valor }) {
  return (
    <div className="bg-white border border-forest-100 rounded-xl p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-forest-50 flex items-center justify-center shrink-0">
        <Icono size={19} className="text-forest-600" />
      </div>
      <div>
        <p className="text-2xl font-serif text-ink-900 leading-none">{valor}</p>
        <p className="text-xs text-ink-500 mt-1">{etiqueta}</p>
      </div>
    </div>
  )
}
