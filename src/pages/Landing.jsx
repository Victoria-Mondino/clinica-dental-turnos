import { CalendarCheck, Search } from 'lucide-react'
import { CLINIC_NAME } from '../data/constants'

export default function Landing({ onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl w-full text-center">
          <p className="uppercase tracking-[0.2em] text-xs font-medium text-forest-500 mb-4">
            {CLINIC_NAME}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-ink-900 leading-tight mb-5">
            Tu turno, en el momento que te queda mejor
          </h1>
          <p className="text-ink-500 text-lg mb-10 max-w-lg mx-auto">
            Reservá online en menos de un minuto o consultá el turno que ya sacaste,
            sin llamadas ni esperas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('reservar')}
              className="inline-flex items-center justify-center gap-2 bg-forest-600 hover:bg-forest-700 text-cream-50 font-medium px-7 py-3.5 rounded-xl shadow-soft transition-colors"
            >
              <CalendarCheck size={20} />
              Reservar turno
            </button>
            <button
              onClick={() => onNavigate('turno')}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-cream-200 text-ink-700 font-medium px-7 py-3.5 rounded-xl border border-forest-100 transition-colors"
            >
              <Search size={20} />
              Ya tengo un turno
            </button>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center">
        <a
          href="#panel"
          className="text-xs text-ink-500/60 hover:text-ink-500 transition-colors"
        >
          Acceso clínica
        </a>
      </footer>
    </div>
  )
}
