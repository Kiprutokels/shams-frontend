import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentService } from '@services/api/appointment.service';
import type { Appointment } from '@types';

interface AppointmentState {
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
  pagination: any;
}

const initialState: AppointmentState = {
  appointments: [],
  currentAppointment: null,
  loading: false,
  error: null,
  pagination: null,
};

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',
  async (params?: any) => {
    const response = await appointmentService.getAll(params);
    return response.data;
  }
);

export const fetchAppointmentById = createAsyncThunk(
  'appointments/fetchById',
  async (id: number) => {
    const response = await appointmentService.getById(id);
    return response.data;
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (data: any) => {
    const response = await appointmentService.create(data);
    return response.data;
  }
);

export const updateAppointment = createAsyncThunk(
  'appointments/update',
  async ({ id, data }: { id: number; data: any }) => {
    const response = await appointmentService.update(id, data);
    return response.data;
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancel',
  async (id: number) => {
    await appointmentService.cancel(id);
    return id;
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.data || action.payload;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch appointments';
      })
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        state.currentAppointment = action.payload;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.appointments.unshift(action.payload);
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        if (state.currentAppointment?.id === action.payload.id) {
          state.currentAppointment = action.payload;
        }
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.filter(a => a.id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;