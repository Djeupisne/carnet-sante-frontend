import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../types'

interface UserState {
  users: User[]
  currentUser: User | null
  isLoading: boolean
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  isLoading: false,
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setUsers, setCurrentUser, setLoading } = userSlice.actions
export default userSlice.reducer