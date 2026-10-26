import { useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { SERVICIOS, PREPAGAS, PROFESIONALES } from '../../data/constants'
import { formatearFecha } from '../../utils/helpers'

export default function ManualTurnoModal({ fechaInicial, onClose, onGuardar }) {
  const [form, setForm] = useState({
    servicio: SERVICIOS[0].id,
    prepaga: PREPAGAS[0].id,
    profesional: PROFESIONALES[0]?.id ?? '',
    fecha: fechaInicial ?? formatearFecha(new Date()),
    hora: '09:00',
    nombre: '',
    telefono: '',
    email: '',
  })
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  function set(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  async function guardar(e) {
    e.preventDefault()
    if (!form.nombre.trim() || !form.telefono.trim()) return
    setGuardando(true)
    setError(null)
    try {
      const servicio = SERVICIOS.find((s) => s.id === form.servicio)
      const prepaga = PREPAGAS.find((p) => p.id === form.prepaga)
      await onGuardar({
        servicio: servicio.nombre,
        duracion: servicio.duracion,
        prepaga: prepaga?.nombre ?? '',
        profesional: form.profesional,
        fecha: form.fecha,
        hora: form.hora,
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        email: form.email.trim(),
      })
      onClose()
    } catch (err) {
      setError(err.message || 'No pudimos guardar el turno.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-ink-900/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl text-ink-900">Cargar turno manual</h2>
          <button onClick={onClose} className="text-ink-500 hover:text-ink-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={guardar} className="grid gap-4">
          <Selector label="Servicio" value={form.servicio} onChange={(v) => set('servicio', v)}>
            {SERVICIOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </Selector>

          <Selector label="Cobertura" value={form.prepaga} onChange={(v) => set('prepaga', v)}>
            {PREPAGAS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </Selector>

          <Selector label="Profesional" value={form.profesional} onChange={(v) => set('profesional', v)}>
            {PROFESIONALES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </Selector>

          <div className="grid grid-cols-2 gap-3">
            <Campo label="Fecha" type="date" value={form.fecha} onChange={(v) => set('fecha', v)} />
            <Campo label="Hora" type="time" value={form.hora} onChange={(v) => set('hora', v)} />
          </div>

          <Campo label="Nombre y apellido" value={form.nombre} onChange={(v) => set('nombre', v)} placeholder="Nombre del paciente" />
          <Campo label="Teléfono" value={form.telefono} onChange={(v) => set('telefono', v)} placeholder="11 5555 5555" />
          <Campo label="Email (opcional)" value={form.email} onChange={(v) => set('email', v)} placeholder="opcional" opcional />

          {error && <p className="text-sm text-clay-600 bg-clay-50 rounded-lg px-3 py-2">{error}</p>}

          <button
            type="submit"
            disabled={guardando}
            className="mt-1 inline-flex items-center justify-center gap-2 bg-forest-600 hover:bg-forest-700 disabled:opacity-50 text-white font-medium px-5 py-3 rounded-lg transition-colors"
          >
            {guardando ? <Loader2 size={17} className="animate-spin" /> : null}
            {guardando ? 'Guardando...' : 'Guardar turno'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Campo({ label, value, onChange, placeholder, type = 'text', opcional }) {
  return (
    <label className="block">
      <span className="text-sm text-ink-500 mb-1 block">
        {label} {opcional && <span className="text-ink-500/50">· opcional</span>}
      </span>
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
