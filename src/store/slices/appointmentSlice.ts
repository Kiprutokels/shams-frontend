import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentService } from '@services/api/appointment.service';
import type {
  Appointment,
  PaginatedResponse,
  CreateAppointmentData,
  UpdateAppointmentData,
} from '@types';

interface AppointmentState {
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
  pagination: PaginatedResponse<Appointment>['pagination'] | null;
}

const initialState: AppointmentState = {
  appointments: [],
  currentAppointment: null,
  loading: false,
  error: null,
  pagination: null,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',
  async (params?: Record<string, unknown>) => {
    return appointmentService.getAll(params);   // PaginatedResponse<Appointment>
  },
);

export const fetchAppointmentById = createAsyncThunk(
  'appointments/fetchById',
  async (id: number) => {
    return appointmentService.getById(id);       // Appointment
  },
);

export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (data: CreateAppointmentData) => {
    return appointmentService.create(data);      // Appointment
  },
);

export const updateAppointment = createAsyncThunk(
  'appointments/update',
  async ({ id, data }: { id: number; data: UpdateAppointmentData }) => {
    return appointmentService.update(id, data);  // Appointment
  },
);

export const confirmAppointment = createAsyncThunk(
  'appointments/confirm',
  async (id: number) => {
    return appointmentService.confirm(id);       // Appointment
  },
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancel',
  async (id: number) => {
    await appointmentService.cancel(id);
    return id;
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearError:              (state) => { state.error = null; },
    clearCurrentAppointment: (state) => { state.currentAppointment = null; },
  },
  extraReducers: (builder) => {
    // ── fetchAll ──────────────────────────────────────────────────────────────
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading     = false;
        state.appointments = action.payload.data;        // Appointment[]
        state.pagination   = action.payload.pagination;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.error.message ?? 'Failed to fetch appointments';
      });

    // ── fetchById ─────────────────────────────────────────────────────────────
    builder
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        state.currentAppointment = action.payload;  // Appointment
      });

    // ── create ────────────────────────────────────────────────────────────────
    builder
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.appointments.unshift(action.payload);
      });

    // ── update ────────────────────────────────────────────────────────────────
    builder
      .addCase(updateAppointment.fulfilled, (state, { payload }) => {
        const idx = state.appointments.findIndex((a) => a.id === payload.id);
        if (idx !== -1) state.appointments[idx] = payload;
        if (state.currentAppointment?.id === payload.id) {
          state.currentAppointment = payload;
        }
      });

    // ── confirm ───────────────────────────────────────────────────────────────
    builder
      .addCase(confirmAppointment.fulfilled, (state, { payload }) => {
        const idx = state.appointments.findIndex((a) => a.id === payload.id);
        if (idx !== -1) state.appointments[idx] = payload;
        if (state.currentAppointment?.id === payload.id) {
          state.currentAppointment = payload;
        }
      });

    // ── cancel ────────────────────────────────────────────────────────────────
    builder
      .addCase(cancelAppointment.fulfilled, (state, { payload: id }) => {
        state.appointments = state.appointments.filter((a) => a.id !== id);
      });
  },
});

export const { clearError, clearCurrentAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;
