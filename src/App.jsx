import { useEffect, useState } from 'react'
import Landing from './pages/Landing'
import BookingWizard from './pages/BookingWizard'
import LookupAppointment from './pages/LookupAppointment'
import AdminPanel from './pages/AdminPanel'

function getRoute() {
  return window.location.hash.replace('#', '') || 'inicio'
}

export default function App() {
  const [route, setRoute] = useState(getRoute())

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (nextRoute) => {
    window.location.hash = nextRoute
  }

  switch (route) {
    case 'reservar':
      return <BookingWizard onExit={() => navigate('inicio')} />
    case 'turno':
      return <LookupAppointment onExit={() => navigate('inicio')} />
    case 'panel':
      return <AdminPanel onExit={() => navigate('inicio')} />
    default:
      return <Landing onNavigate={navigate} />
  }
}
