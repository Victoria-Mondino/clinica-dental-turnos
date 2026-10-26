import { useEffect, useState, useCallback } from 'react'
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'

const COLECCION = 'blockedSlots'

export function useBlockedSlots() {
  const [blockedSlots, setBlockedSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, COLECCION), orderBy('fecha', 'asc'))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setBlockedSlots(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  const addBlock = useCallback(async (data) => {
    await addDoc(collection(db, COLECCION), data)
  }, [])

  const removeBlock = useCallback(async (id) => {
    await deleteDoc(doc(db, COLECCION, id))
  }, [])

  return { blockedSlots, loading, error, addBlock, removeBlock }
}
