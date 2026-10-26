import { useEffect, useState, useCallback } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { generarCodigoTurno } from '../utils/helpers'

const COLECCION = 'appointments'

export function useAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, COLECCION), orderBy('fecha', 'asc'), orderBy('hora', 'asc'))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setAppointments(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  const addAppointment = useCallback(async (data) => {
    const codigo = generarCodigoTurno()
    await addDoc(collection(db, COLECCION), {
      ...data,
      codigo,
      estado: 'confirmado',
      createdAt: serverTimestamp(),
    })
    return codigo
  }, [])

  const cancelAppointment = useCallback(async (id) => {
    await updateDoc(doc(db, COLECCION, id), { estado: 'cancelado' })
  }, [])

  const findByCode = useCallback(
    (codigo) => {
      if (!codigo) return null
      return (
        appointments.find((a) => a.codigo.toUpperCase() === codigo.trim().toUpperCase()) ?? null
      )
    },
    [appointments]
  )

  return { appointments, loading, error, addAppointment, cancelAppointment, findByCode }
}
