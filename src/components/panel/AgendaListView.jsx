import { Ban, CheckCircle2 } from 'lucide-react'
import { getProfesional } from '../../data/constants'

export default function AgendaListView({ turnos, onCancelar }) {
  if (turnos.length === 0) {
    return (
      <div className="bg-white border border-forest-100 rounded-xl py-16 text-center text-sm text-ink-500">
        No hay turnos para mostrar con estos filtros.
      </div>
    )
  }

  return (
    <div className="bg-white border border-forest-100 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-cream-200 text-left text-xs text-ink-500/70 uppercase tracking-wide">
            <th className="px-4 py-3 font-medium">Fecha</th>
            <th className="px-4 py-3 font-medium">Hora</th>
            <th className="px-4 py-3 font-medium">Paciente</th>
            <th className="px-4 py-3 font-medium">Servicio</th>
            <th className="px-4 py-3 font-medium">Profesional</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium text-right">Acción</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((t) => (
            <tr key={t.id} className="border-b border-cream-200 last:border-b-0 hover:bg-cream-50/60">
              <td className="px-4 py-3 text-ink-700">{t.fecha}</td>
              <td className="px-4 py-3 text-ink-700">{t.hora}</td>
              <td className="px-4 py-3 text-ink-900 font-medium">{t.nombre}</td>
              <td className="px-4 py-3 text-ink-700">{t.servicio}</td>
              <td className="px-4 py-3 text-ink-700">{getProfesional(t.profesional)?.nombre ?? t.profesional}</td>
              <td className="px-4 py-3">
                <EstadoBadge estado={t.estado} />
              </td>
              <td className="px-4 py-3 text-right">
                {t.estado === 'confirmado' && (
                  <button
                    onClick={() => onCancelar(t.id)}
                    className="inline-flex items-center gap-1 text-xs text-clay-600 hover:text-clay-500 font-medium"
                  >
                    <Ban size={13} />
                    Cancelar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EstadoBadge({ estado }) {
  if (estado === 'cancelado') {
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-clay-50 text-clay-600">
        Cancelado
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-forest-50 text-forest-600">
      <CheckCircle2 size={11} />
      Confirmado
    </span>
  )
}
