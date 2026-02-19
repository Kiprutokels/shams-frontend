import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { queueService } from '@services/api/queue.service';
import type { Queue } from '@types';

interface QueueState {
  queueEntries: Queue[];
  myPosition: any;
  loading: boolean;
  error: string | null;
}

const initialState: QueueState = {
  queueEntries: [],
  myPosition: null,
  loading: false,
  error: null,
};

export const fetchQueue = createAsyncThunk(
  'queue/fetchAll',
  async (params?: any) => {
    const response = await queueService.getAll(params);
    return response.data;
  }
);

export const fetchMyPosition = createAsyncThunk(
  'queue/fetchMyPosition',
  async () => {
    const response = await queueService.getMyPosition();
    return response.data;
  }
);

const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    updateQueueEntry: (state, action) => {
      const index = state.queueEntries.findIndex(q => q.id === action.payload.id);
      if (index !== -1) {
        state.queueEntries[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQueue.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQueue.fulfilled, (state, action) => {
        state.loading = false;
        state.queueEntries = action.payload;
      })
      .addCase(fetchQueue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch queue';
      })
      .addCase(fetchMyPosition.fulfilled, (state, action) => {
        state.myPosition = action.payload;
      });
  },
});

export const { updateQueueEntry } = queueSlice.actions;
export default queueSlice.reducer;