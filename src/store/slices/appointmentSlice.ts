import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Appointment } from '../../types'

interface AppointmentState {
  appointments: Appointment[]
  selectedAppointment: Appointment | null
  isLoading: boolean
}

const initialState: AppointmentState = {
  appointments: [],
  selectedAppointment: null,
  isLoading: false,
}

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload
    },
    setSelectedAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.selectedAppointment = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setAppointments, setSelectedAppointment, setLoading } = appointmentSlice.actions
export default appointmentSlice.reducer