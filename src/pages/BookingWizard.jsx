import { useMemo, useState } from 'react'
import { ArrowLeft, Check, Loader2, Sparkles, X } from 'lucide-react'
import { SERVICIOS, PREPAGAS, PROFESIONALES, CLINIC_NAME } from '../data/constants'
import {
  proximosDiasHabiles,
  horariosLibresDeProfesional,
  horariosLibresPrimerDisponible,
  resolverProfesionalDisponible,
} from '../utils/helpers'
import { useAppointments } from '../hooks/useAppointments'
import { useBlockedSlots } from '../hooks/useBlockedSlots'

const PASOS = ['Servicio', 'Cobertura', 'Profesional', 'Día y horario', 'Tus datos']

export default function BookingWizard({ onExit }) {
  const [paso, setPaso] = useState(0)
  const [form, setForm] = useState({
    servicio: null,
    prepaga: null,
    profesional: null, // id de profesional, o 'primero-disponible'
    fecha: null,
    hora: null,
    nombre: '',
    telefono: '',
    email: '',
  })
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)
  const [codigoConfirmado, setCodigoConfirmado] = useState(null)

  const { appointments, addAppointment } = useAppointments()
  const { blockedSlots } = useBlockedSlots()

  const servicioSeleccionado = useMemo(
    () => SERVICIOS.find((s) => s.id === form.servicio) ?? null,
    [form.servicio]
  )

  const dias = useMemo(() => proximosDiasHabiles(10), [])

  function actualizar(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  function irA(pasoSiguiente) {
    setError(null)
    setPaso(pasoSiguiente)
  }

  async function confirmarTurno() {
    if (!servicioSeleccionado || !form.fecha || !form.hora) return
    setGuardando(true)
    setError(null)
    try {
      let profesionalFinal = form.profesional

      if (form.profesional === 'primero-disponible') {
        const resuelto = resolverProfesionalDisponible({
          fecha: form.fecha,
          hora: form.hora,
          duracionServicio: servicioSeleccionado.duracion,
          turnos: appointments,
          bloqueos: blockedSlots,
        })
        if (!resuelto) {
          throw new Error('Ese horario ya no está disponible. Elegí otro, por favor.')
        }
        profesionalFinal = resuelto.id
      }

      const codigo = await addAppointment({
        servicio: servicioSeleccionado.nombre,
        duracion: servicioSeleccionado.duracion,
        prepaga: PREPAGAS.find((p) => p.id === form.prepaga)?.nombre ?? '',
        profesional: profesionalFinal,
        fecha: form.fecha,
        hora: form.hora,
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        email: form.email.trim(),
      })

      setCodigoConfirmado(codigo)
    } catch (err) {
      setError(err.message || 'No pudimos guardar tu turno. Probá de nuevo en un momento.')
    } finally {
      setGuardando(false)
    }
  }

  if (codigoConfirmado) {
    return (
      <ConfirmacionScreen
        codigo={codigoConfirmado}
        form={form}
        servicio={servicioSeleccionado}
        onExit={onExit}
      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-forest-100 bg-white">
        <div className="max-w-2xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onExit}
              className="text-ink-500 hover:text-ink-700 flex items-center gap-1.5 text-sm"
            >
              <X size={18} />
              Cerrar
            </button>
            <p className="text-xs uppercase tracking-wide text-forest-500 font-medium">
              {CLINIC_NAME}
            </p>
          </div>
          <ProgressBar paso={paso} />
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-10">
        {paso > 0 && (
          <button
            onClick={() => irA(paso - 1)}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-700"
          >
            <ArrowLeft size={16} />
            Volver
          </button>
        )}

        {paso === 0 && (
          <PasoServicio
            seleccionado={form.servicio}
            onElegir={(id) => {
              actualizar('servicio', id)
              irA(1)
            }}
          />
        )}

        {paso === 1 && (
          <PasoPrepaga
            seleccionado={form.prepaga}
            onElegir={(id) => {
              actualizar('prepaga', id)
              irA(2)
            }}
          />
        )}

        {paso === 2 && (
          <PasoProfesional
            seleccionado={form.profesional}
            onElegir={(id) => {
              actualizar('profesional', id)
              irA(3)
            }}
          />
        )}

        {paso === 3 && (
          <PasoFechaHorario
            dias={dias}
            form={form}
            servicio={servicioSeleccionado}
            appointments={appointments}
            blockedSlots={blockedSlots}
            onElegir={(fecha, hora) => {
              actualizar('fecha', fecha)
              actualizar('hora', hora)
              irA(4)
            }}
          />
        )}

        {paso === 4 && (
          <PasoDatos
            form={form}
            guardando={guardando}
            error={error}
            onCambiar={actualizar}
            onConfirmar={confirmarTurno}
          />
        )}
      </main>
    </div>
  )
}

function ProgressBar({ paso }) {
  return (
    <div>
      <div className="flex gap-1.5 mb-2">
        {PASOS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= paso ? 'bg-forest-500' : 'bg-forest-100'
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-ink-500">
        Paso {paso + 1} de {PASOS.length} · {PASOS[paso]}
      </p>
    </div>
  )
}

function OpcionCard({ activo, onClick, titulo, subtitulo, children }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
        activo
          ? 'border-forest-500 bg-forest-50'
          : 'border-forest-100 bg-white hover:border-forest-300'
      }`}
    >
      <div>
        <p className="font-medium text-ink-900">{titulo}</p>
        {subtitulo && <p className="text-sm text-ink-500 mt-0.5">{subtitulo}</p>}
      </div>
      {children}
    </button>
  )
}

function PasoServicio({ seleccionado, onElegir }) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-ink-900 mb-5">¿Qué necesitás?</h2>
      <div className="grid gap-3">
        {SERVICIOS.map((s) => (
          <OpcionCard
            key={s.id}
            activo={seleccionado === s.id}
            onClick={() => onElegir(s.id)}
            titulo={s.nombre}
            subtitulo={`${s.duracion} min aprox.`}
          />
        ))}
      </div>
    </div>
  )
}

function PasoPrepaga({ seleccionado, onElegir }) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-ink-900 mb-5">¿Con qué cobertura venís?</h2>
      <div className="grid gap-3">
        {PREPAGAS.map((p) => (
          <OpcionCard
            key={p.id}
            activo={seleccionado === p.id}
            onClick={() => onElegir(p.id)}
            titulo={p.nombre}
          />
        ))}
      </div>
    </div>
  )
}

function PasoProfesional({ seleccionado, onElegir }) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-ink-900 mb-5">¿Con quién preferís atenderte?</h2>
      <div className="grid gap-3">
        <OpcionCard
          activo={seleccionado === 'primero-disponible'}
          onClick={() => onElegir('primero-disponible')}
          titulo="El primero disponible"
          subtitulo="Te asignamos el turno más próximo entre todos los profesionales"
        >
          <Sparkles size={18} className="text-forest-500 shrink-0" />
        </OpcionCard>
        {PROFESIONALES.map((p) => (
          <OpcionCard
            key={p.id}
            activo={seleccionado === p.id}
            onClick={() => onElegir(p.id)}
            titulo={p.nombre}
            subtitulo={p.especialidad}
          />
        ))}
      </div>
    </div>
  )
}

function PasoFechaHorario({ dias, form, servicio, appointments, blockedSlots, onElegir }) {
  const [fechaElegida, setFechaElegida] = useState(form.fecha ?? dias[0]?.fecha)

  const horariosLibres = useMemo(() => {
    if (!fechaElegida || !servicio) return []
    if (form.profesional === 'primero-disponible') {
      return horariosLibresPrimerDisponible({
        fecha: fechaElegida,
        duracionServicio: servicio.duracion,
        turnos: appointments,
        bloqueos: blockedSlots,
      })
    }
    return horariosLibresDeProfesional({
      profesionalId: form.profesional,
      fecha: fechaElegida,
      duracionServicio: servicio.duracion,
      turnos: appointments,
      bloqueos: blockedSlots,
    })
  }, [fechaElegida, servicio, form.profesional, appointments, blockedSlots])

  return (
    <div>
      <h2 className="font-serif text-2xl text-ink-900 mb-5">Elegí día y horario</h2>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
        {dias.map((d) => (
          <button
            key={d.fecha}
            onClick={() => setFechaElegida(d.fecha)}
            className={`shrink-0 px-4 py-2.5 rounded-lg border text-sm capitalize transition-colors ${
              fechaElegida === d.fecha
                ? 'border-forest-500 bg-forest-500 text-white'
                : 'border-forest-100 bg-white text-ink-700 hover:border-forest-300'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {horariosLibres.length === 0 ? (
        <p className="text-sm text-ink-500 bg-cream-200 rounded-lg px-4 py-6 text-center">
          No hay horarios libres ese día. Probá con otra fecha.
        </p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {horariosLibres.map((h) => (
            <button
              key={h}
              onClick={() => onElegir(fechaElegida, h)}
              className="px-3 py-2.5 rounded-lg border border-forest-100 bg-white hover:border-forest-500 hover:bg-forest-50 text-sm font-medium text-ink-700 transition-colors"
            >
              {h}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function PasoDatos({ form, guardando, error, onCambiar, onConfirmar }) {
  const listo = form.nombre.trim() && form.telefono.trim()

  return (
    <div>
      <h2 className="font-serif text-2xl text-ink-900 mb-5">Tus datos</h2>

      <div className="grid gap-4 mb-6">
        <Campo
          label="Nombre y apellido"
          value={form.nombre}
          onChange={(v) => onCambiar('nombre', v)}
          placeholder="Ana Martínez"
        />
        <Campo
          label="Teléfono"
          value={form.telefono}
          onChange={(v) => onCambiar('telefono', v)}
          placeholder="11 5555 5555"
          type="tel"
        />
        <Campo
          label="Email (opcional)"
          value={form.email}
          onChange={(v) => onCambiar('email', v)}
          placeholder="ana@mail.com"
          type="email"
          opcional
        />
      </div>

      {error && (
        <p className="text-sm text-clay-600 bg-clay-50 rounded-lg px-4 py-3 mb-4">{error}</p>
      )}

      <button
        disabled={!listo || guardando}
        onClick={onConfirmar}
        className="w-full inline-flex items-center justify-center gap-2 bg-forest-600 hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed text-cream-50 font-medium px-6 py-3.5 rounded-xl transition-colors"
      >
        {guardando ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Guardando turno...
          </>
        ) : (
          'Confirmar turno'
        )}
      </button>
    </div>
  )
}

function Campo({ label, value, onChange, placeholder, type = 'text', opcional }) {
  return (
    <label className="block">
      <span className="text-sm text-ink-500 mb-1.5 block">
        {label} {opcional && <span className="text-ink-500/50">· opcional</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border border-forest-100 bg-white focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100 text-ink-900"
      />
    </label>
  )
}

function ConfirmacionScreen({ codigo, form, servicio, onExit }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-6">
          <Check size={26} className="text-forest-600" />
        </div>
        <h1 className="font-serif text-2xl text-ink-900 mb-2">¡Turno confirmado!</h1>
        <p className="text-ink-500 mb-6">Guardá este código para consultarlo o cancelarlo cuando quieras.</p>

        <p className="text-4xl font-serif tracking-[0.2em] text-forest-600 bg-forest-50 rounded-xl py-5 mb-6">
          {codigo}
        </p>

        <div className="text-left bg-white border border-forest-100 rounded-xl p-5 mb-8 grid gap-2 text-sm">
          <Fila label="Servicio" valor={servicio?.nombre} />
          <Fila label="Fecha" valor={form.fecha} />
          <Fila label="Horario" valor={form.hora} />
          <Fila label="Nombre" valor={form.nombre} />
        </div>

        <button
          onClick={onExit}
          className="w-full bg-forest-600 hover:bg-forest-700 text-cream-50 font-medium px-6 py-3.5 rounded-xl transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}

function Fila({ label, valor }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-500">{label}</span>
      <span className="text-ink-900 font-medium">{valor}</span>
    </div>
  )
}
