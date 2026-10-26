import { useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { PROFESIONALES, getProfesional } from '../../data/constants'
import { formatearFecha } from '../../utils/helpers'

export default function BloqueosTab({ blockedSlotsState }) {
  const { blockedSlots, loading, addBlock, removeBlock } = blockedSlotsState

  const [form, setForm] = useState({
    fecha: formatearFecha(new Date()),
    profesional: 'all',
    diaCompleto: true,
    hora: '09:00',
    duracion: 30,
    motivo: '',
  })
  const [guardando, setGuardando] = useState(false)

  function set(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  async function guardar(e) {
    e.preventDefault()
    setGuardando(true)
    try {
      const data = {
        fecha: form.fecha,
        profesional: form.profesional,
        diaCompleto: form.diaCompleto,
        motivo: form.motivo.trim(),
      }
      if (!form.diaCompleto) {
        data.hora = form.hora
        data.duracion = Number(form.duracion)
      }
      await addBlock(data)
      set('motivo', '')
    } finally {
      setGuardando(false)
    }
  }

  const bloqueosOrdenados = [...blockedSlots].sort((a, b) => a.fecha.localeCompare(b.fecha))

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl text-ink-900 mb-6">Bloqueos y feriados</h1>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
        <form onSubmit={guardar} className="bg-white border border-forest-100 rounded-xl p-5 grid gap-4">
          <h2 className="font-medium text-ink-900">Nuevo bloqueo</h2>

          <Campo label="Fecha" type="date" value={form.fecha} onChange={(v) => set('fecha', v)} />

          <Selector label="Profesional" value={form.profesional} onChange={(v) => set('profesional', v)}>
            <option value="all">Todos los profesionales</option>
            {PROFESIONALES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </Selector>

          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={form.diaCompleto}
              onChange={(e) => set('diaCompleto', e.target.checked)}
              className="accent-forest-600"
            />
            Bloquear el día completo
          </label>

          {!form.diaCompleto && (
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Hora" type="time" value={form.hora} onChange={(v) => set('hora', v)} />
              <Campo
                label="Duración (min)"
                type="number"
                value={form.duracion}
                onChange={(v) => set('duracion', v)}
              />
            </div>
          )}

          <Campo
            label="Motivo (opcional)"
            value={form.motivo}
            onChange={(v) => set('motivo', v)}
            placeholder="Feriado, capacitación, etc."
          />

          <button
            type="submit"
            disabled={guardando}
            className="inline-flex items-center justify-center gap-2 bg-forest-600 hover:bg-forest-700 disabled:opacity-50 text-white font-medium px-5 py-3 rounded-lg transition-colors"
          >
            {guardando ? <Loader2 size={17} className="animate-spin" /> : null}
            {guardando ? 'Guardando...' : 'Guardar bloqueo'}
          </button>
        </form>

        <div className="bg-white border border-forest-100 rounded-xl overflow-hidden">
          {loading ? (
            <p className="text-sm text-ink-500 py-10 text-center">Cargando bloqueos...</p>
          ) : bloqueosOrdenados.length === 0 ? (
            <p className="text-sm text-ink-500 py-10 text-center">No hay bloqueos activos.</p>
          ) : (
            <ul>
              {bloqueosOrdenados.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between px-4 py-3.5 border-b border-cream-200 last:border-b-0"
                >
                  <div className="text-sm">
                    <p className="text-ink-900 font-medium">
                      {b.fecha} · {b.profesional === 'all' ? 'Todos' : getProfesional(b.profesional)?.nombre ?? b.profesional}
                    </p>
                    <p className="text-ink-500 text-xs">
                      {b.diaCompleto ? 'Día completo' : `${b.hora} · ${b.duracion} min`}
                      {b.motivo ? ` · ${b.motivo}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => removeBlock(b.id)}
                    className="text-ink-500 hover:text-clay-600 transition-colors p-1.5"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function Campo({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block">
      <span className="text-sm text-ink-500 mb-1 block">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-lg border border-forest-100 bg-white focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100 text-ink-900 text-sm"
      />
    </label>
  )
}

function Selector({ label, value, onChange, children }) {
  return (
    <label className="block">
      <span className="text-sm text-ink-500 mb-1 block">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg border border-forest-100 bg-white focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100 text-ink-900 text-sm"
      >
        {children}
      </select>
    </label>
  )
}
