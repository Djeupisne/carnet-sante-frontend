import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'patient' | 'doctor' | 'admin'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload
    },
    loginFailure: (state) => {
      state.isLoading = false
      state.isAuthenticated = false
      state.user = null
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, setUser } = authSlice.actions
export default authSlice.reducer