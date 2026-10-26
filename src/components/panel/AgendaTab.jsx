import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { sumarDias, nombreDiaLargo, formatearFecha } from '../../utils/helpers'
import MiniCalendar from './MiniCalendar'
import AgendaCalendarBoard from './AgendaCalendarBoard'
import AgendaListView from './AgendaListView'
import ManualTurnoModal from './ManualTurnoModal'

export default function AgendaTab({ appointmentsState, blockedSlotsState }) {
  const { appointments, loading, addAppointment, cancelAppointment } = appointmentsState
  const [vista, setVista] = useState('calendario') // 'calendario' | 'lista'
  const [fecha, setFecha] = useState(formatearFecha(new Date()))
  const [verCancelados, setVerCancelados] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)

  const turnosDelDia = useMemo(() => {
    return appointments.filter(
      (t) => t.fecha === fecha && (verCancelados || t.estado !== 'cancelado')
    )
  }, [appointments, fecha, verCancelados])

  const turnosLista = useMemo(() => {
    return appointments.filter((t) => verCancelados || t.estado !== 'cancelado')
  }, [appointments, verCancelados])

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl text-ink-900 mb-1">Agenda</h1>
          <p className="text-sm text-ink-500">{nombreDiaLargo(fecha)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-ink-500 select-none">
            <input
              type="checkbox"
              checked={verCancelados}
              onChange={(e) => setVerCancelados(e.target.checked)}
              className="accent-forest-600"
            />
            Ver cancelados
          </label>

          <div className="flex bg-cream-200 rounded-lg p-1">
            <button
              onClick={() => setVista('calendario')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                vista === 'calendario' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'
              }`}
            >
              Calendario
            </button>
            <button
              onClick={() => setVista('lista')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                vista === 'lista' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'
              }`}
            >
              Lista
            </button>
          </div>

          <button
            onClick={() => setModalAbierto(true)}
            className="inline-flex items-center gap-1.5 bg-forest-600 hover:bg-forest-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Cargar turno
          </button>
        </div>
      </div>

      {vista === 'calendario' && (
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setFecha(formatearFecha(new Date()))}
            className="px-3 py-1.5 rounded-lg bg-forest-600 text-white text-sm font-medium hover:bg-forest-700 transition-colors"
          >
            Hoy
          </button>
          <button
            onClick={() => setFecha((f) => sumarDias(f, -1))}
            className="p-1.5 rounded-lg border border-forest-100 text-ink-500 hover:bg-cream-200"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setFecha((f) => sumarDias(f, 1))}
            className="p-1.5 rounded-lg border border-forest-100 text-ink-500 hover:bg-cream-200"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-ink-500 py-10 text-center">Cargando agenda...</p>
      ) : vista === 'calendario' ? (
        <div className="flex flex-col xl:flex-row gap-6 items-start">
          <div className="w-full xl:flex-1 xl:min-w-[360px]">
            <AgendaCalendarBoard turnosDelDia={turnosDelDia} />
          </div>
          <MiniCalendar fechaSeleccionada={fecha} onSeleccionar={setFecha} />
        </div>
      ) : (
        <AgendaListView turnos={turnosLista} onCancelar={cancelAppointment} />
      )}

      {modalAbierto && (
        <ManualTurnoModal
          fechaInicial={fecha}
          onClose={() => setModalAbierto(false)}
          onGuardar={addAppointment}
        />
      )}
    </div>
  )
}
