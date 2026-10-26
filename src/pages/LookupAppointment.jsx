import { useState } from 'react'
import { AlertCircle, Ban, Calendar, CheckCircle2, Loader2, X } from 'lucide-react'
import { useAppointments } from '../hooks/useAppointments'
import { getProfesional } from '../data/constants'

export default function LookupAppointment({ onExit }) {
  const { findByCode, cancelAppointment, loading } = useAppointments()
  const [codigoInput, setCodigoInput] = useState('')
  const [buscado, setBuscado] = useState(null) // null = no buscó todavía
  const [cancelando, setCancelando] = useState(false)
  const [confirmandoCancelacion, setConfirmandoCancelacion] = useState(false)

  function buscar(e) {
    e.preventDefault()
    if (!codigoInput.trim()) return
    setBuscado(findByCode(codigoInput))
  }

  async function cancelar() {
    if (!buscado) return
    setCancelando(true)
    try {
      await cancelAppointment(buscado.id)
      setBuscado((prev) => ({ ...prev, estado: 'cancelado' }))
      setConfirmandoCancelacion(false)
    } finally {
      setCancelando(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-forest-100 bg-white">
        <div className="max-w-lg mx-auto px-6 py-5 flex items-center justify-between">
          <button onClick={onExit} className="text-ink-500 hover:text-ink-700 flex items-center gap-1.5 text-sm">
            <X size={18} />
            Cerrar
          </button>
          <p className="text-xs uppercase tracking-wide text-forest-500 font-medium">Mi turno</p>
        </div>
      </header>

      <main className="flex-1 max-w-lg w-full mx-auto px-6 py-12">
        <h1 className="font-serif text-2xl text-ink-900 mb-2">Consultá tu turno</h1>
        <p className="text-ink-500 mb-8">Ingresá el código de 6 caracteres que te dimos al reservar.</p>

        <form onSubmit={buscar} className="flex gap-2 mb-8">
          <input
            value={codigoInput}
            onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
            placeholder="Ej: A3F9K2"
            maxLength={6}
            className="flex-1 px-4 py-3 rounded-lg border border-forest-100 bg-white focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100 text-ink-900 tracking-[0.2em] font-medium uppercase"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-forest-600 hover:bg-forest-700 disabled:opacity-50 text-cream-50 font-medium transition-colors"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Buscar'}
          </button>
        </form>

        {buscado === null && codigoInput === '' && (
          <p className="text-sm text-ink-500/70 text-center">
            Escribí tu código arriba para ver el detalle del turno.
          </p>
        )}

        {buscado === null && codigoInput !== '' && (
          <EstadoVacio
            icono={<AlertCircle size={22} className="text-clay-600" />}
            titulo="No encontramos ese turno"
            texto="Revisá que el código esté bien escrito. Si el problema sigue, contactanos directamente."
          />
        )}

        {buscado && (
          <div className="bg-white border border-forest-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <span className="text-3xl font-serif tracking-[0.2em] text-forest-600">
                {buscado.codigo}
              </span>
              <EstadoBadge estado={buscado.estado} />
            </div>

            <div className="grid gap-2.5 text-sm mb-6">
              <Fila label="Servicio" valor={buscado.servicio} />
              <Fila
                label="Profesional"
                valor={getProfesional(buscado.profesional)?.nombre ?? buscado.profesional}
              />
              <Fila label="Fecha" valor={buscado.fecha} icono={<Calendar size={14} />} />
              <Fila label="Horario" valor={buscado.hora} />
              <Fila label="Nombre" valor={buscado.nombre} />
            </div>

            {buscado.estado === 'confirmado' && !confirmandoCancelacion && (
              <button
                onClick={() => setConfirmandoCancelacion(true)}
                className="w-full inline-flex items-center justify-center gap-2 border border-clay-500 text-clay-600 hover:bg-clay-50 font-medium px-5 py-3 rounded-lg transition-colors"
              >
                <Ban size={16} />
                Cancelar turno
              </button>
            )}

            {buscado.estado === 'confirmado' && confirmandoCancelacion && (
              <div className="bg-cream-200 rounded-lg p-4">
                <p className="text-sm text-ink-700 mb-3">¿Seguro que querés cancelar este turno?</p>
                <div className="flex gap-2">
                  <button
                    onClick={cancelar}
                    disabled={cancelando}
                    className="flex-1 bg-clay-600 hover:bg-clay-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                  >
                    {cancelando ? 'Cancelando...' : 'Sí, cancelar'}
                  </button>
                  <button
                    onClick={() => setConfirmandoCancelacion(false)}
                    className="flex-1 bg-white border border-forest-100 text-ink-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                  >
                    Volver
                  </button>
                </div>
              </div>
            )}

            {buscado.estado === 'cancelado' && (
              <p className="text-sm text-ink-500 bg-cream-200 rounded-lg px-4 py-3 text-center">
                Este turno ya está cancelado.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

function EstadoBadge({ estado }) {
  if (estado === 'cancelado') {
    return (
      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-clay-50 text-clay-600">
        Cancelado
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-forest-50 text-forest-600">
      <CheckCircle2 size={12} />
      Confirmado
    </span>
  )
}

function Fila({ label, valor, icono }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-ink-500 flex items-center gap-1.5">
        {icono}
        {label}
      </span>
      <span className="text-ink-900 font-medium">{valor}</span>
    </div>
  )
}

function EstadoVacio({ icono, titulo, texto }) {
  return (
    <div className="bg-cream-200 rounded-xl p-6 text-center">
      <div className="mb-3 flex justify-center">{icono}</div>
      <p className="font-medium text-ink-900 mb-1">{titulo}</p>
      <p className="text-sm text-ink-500">{texto}</p>
    </div>
  )
}
