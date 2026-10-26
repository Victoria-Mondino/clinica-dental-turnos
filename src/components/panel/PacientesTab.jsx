import { useMemo } from 'react'

export default function PacientesTab({ appointmentsState }) {
  const { appointments, loading } = appointmentsState

  const pacientes = useMemo(() => {
    const porTelefono = new Map()

    for (const turno of appointments) {
      const clave = turno.telefono || turno.nombre
      const actual = porTelefono.get(clave)
      if (!actual || `${turno.fecha}${turno.hora}` > `${actual.ultimoTurno.fecha}${actual.ultimoTurno.hora}`) {
        porTelefono.set(clave, {
          nombre: turno.nombre,
          telefono: turno.telefono,
          cantidad: (actual?.cantidad ?? 0) + 1,
          ultimoTurno: turno,
        })
      } else {
        porTelefono.set(clave, { ...actual, cantidad: actual.cantidad + 1 })
      }
    }

    return Array.from(porTelefono.values()).sort((a, b) => a.nombre.localeCompare(b.nombre))
  }, [appointments])

  if (loading) {
    return <p className="p-8 text-sm text-ink-500">Cargando pacientes...</p>
  }

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl text-ink-900 mb-6">Pacientes</h1>

      {pacientes.length === 0 ? (
        <div className="bg-white border border-forest-100 rounded-xl py-16 text-center text-sm text-ink-500">
          Todavía no hay turnos cargados.
        </div>
      ) : (
        <div className="bg-white border border-forest-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-200 text-left text-xs text-ink-500/70 uppercase tracking-wide">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3 font-medium">Turnos</th>
                <th className="px-4 py-3 font-medium">Último turno</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <tr key={p.telefono || p.nombre} className="border-b border-cream-200 last:border-b-0 hover:bg-cream-50/60">
                  <td className="px-4 py-3 text-ink-900 font-medium">{p.nombre}</td>
                  <td className="px-4 py-3 text-ink-700">{p.telefono || '—'}</td>
                  <td className="px-4 py-3 text-ink-700">{p.cantidad}</td>
                  <td className="px-4 py-3 text-ink-700">
                    {p.ultimoTurno.fecha} · {p.ultimoTurno.hora}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
