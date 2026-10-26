# Clínica Dental — Sistema de turnos

Vite + React + Tailwind + Firestore. Reserva pública de turnos, consulta/cancelación por código, y panel interno con agenda tipo calendario.

## Puesta en marcha

1. Instalar dependencias:
   ```
   npm install
   ```
2. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/), activar **Firestore Database**.
3. Copiar `.env.example` a `.env` y completar con las credenciales web del proyecto (Configuración del proyecto → Tus apps → SDK de Firebase).
4. Publicar las reglas de `firestore.rules` en Firestore (pestaña Reglas, o vía `firebase deploy --only firestore:rules` si usás la CLI).
5. Levantar el proyecto:
   ```
   npm run dev
   ```

## Datos de la clínica

Todo lo específico de la clínica (nombre, servicios, prepagas, profesionales) está centralizado en [src/data/constants.js](src/data/constants.js) — son placeholders de ejemplo, reemplazalos por los reales.

## Estructura

- `src/pages/Landing.jsx` — portada pública
- `src/pages/BookingWizard.jsx` — reserva en 5 pasos
- `src/pages/LookupAppointment.jsx` — consultar/cancelar por código
- `src/pages/AdminPanel.jsx` + `src/components/panel/*` — panel interno (Resumen, Agenda, Pacientes, Bloqueos)
- `src/hooks/useAppointments.js`, `src/hooks/useBlockedSlots.js` — datos en tiempo real desde Firestore
- `src/utils/helpers.js` — disponibilidad de horarios, códigos de turno, fechas

## Acceso al panel

Desde la portada, link "Acceso clínica" al pie → `/#panel`. Todavía no tiene login (ver Prompt 7 de la guía original si se quiere sumar Firebase Auth más adelante).
