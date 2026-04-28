import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const submitContact = createAsyncThunk(
  'contact/submit',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/contatti/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const json = await res.json()

      if (!res.ok) {
        return rejectWithValue(json?.error?.message ?? 'Errore durante l\'invio.')
      }

      return json.data
    } catch {
      return rejectWithValue('Connessione non disponibile. Riprova più tardi.')
    }
  }
)

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    status: 'idle', // idle | loading | success | error
    error: null,
  },
  reducers: {
    resetContact: (state) => {
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContact.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(submitContact.fulfilled, (state) => {
        state.status = 'success'
        state.error = null
      })
      .addCase(submitContact.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload
      })
  },
})

export const { resetContact } = contactSlice.actions

// Selectors
export const selectContactStatus = (state) => state.contact.status
export const selectContactError = (state) => state.contact.error

export default contactSlice.reducer
