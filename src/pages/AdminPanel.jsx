import { useState } from 'react'
import { CalendarRange, LayoutGrid, LogOut, ShieldCheck, Users } from 'lucide-react'
import { CLINIC_NAME } from '../data/constants'
import { useAppointments } from '../hooks/useAppointments'
import { useBlockedSlots } from '../hooks/useBlockedSlots'
import ResumenTab from '../components/panel/ResumenTab'
import AgendaTab from '../components/panel/AgendaTab'
import PacientesTab from '../components/panel/PacientesTab'
import BloqueosTab from '../components/panel/BloqueosTab'

const TABS = [
  { id: 'resumen', label: 'Resumen', icon: LayoutGrid },
  { id: 'agenda', label: 'Agenda', icon: CalendarRange },
  { id: 'pacientes', label: 'Pacientes', icon: Users },
  { id: 'bloqueos', label: 'Bloqueos', icon: ShieldCheck },
]

export default function AdminPanel({ onExit }) {
  const [tab, setTab] = useState('agenda')
  const appointmentsState = useAppointments()
  const blockedSlotsState = useBlockedSlots()

  return (
    <div className="min-h-screen flex bg-cream-100">
      <aside className="w-56 shrink-0 bg-forest-800 text-cream-100 flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-xs uppercase tracking-widest text-forest-300 mb-0.5">Panel</p>
          <p className="font-serif text-lg leading-tight">{CLINIC_NAME}</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === id
                  ? 'bg-forest-700 text-white'
                  : 'text-forest-100/80 hover:bg-forest-700/60 hover:text-white'
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={onExit}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-forest-100/70 hover:bg-forest-700/60 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Salir al sitio
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-auto">
        {tab === 'resumen' && (
          <ResumenTab appointmentsState={appointmentsState} onIrAAgenda={() => setTab('agenda')} />
        )}
        {tab === 'agenda' && (
          <AgendaTab appointmentsState={appointmentsState} blockedSlotsState={blockedSlotsState} />
        )}
        {tab === 'pacientes' && <PacientesTab appointmentsState={appointmentsState} />}
        {tab === 'bloqueos' && <BloqueosTab blockedSlotsState={blockedSlotsState} />}
      </main>
    </div>
  )
}
