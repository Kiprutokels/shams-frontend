import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@services/api/user.service';
import type { User } from '@types';

interface UserState {
  profile: User | null;
  stats: any;
  doctors: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  stats: null,
  doctors: [],
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async () => {
    const response = await userService.getProfile();
    return response.data;
  }
);

export const fetchStats = createAsyncThunk(
  'user/fetchStats',
  async () => {
    const response = await userService.getStats();
    return response.data;
  }
);

export const fetchDoctors = createAsyncThunk(
  'user/fetchDoctors',
  async (specialization?: string) => {
    const response = await userService.getDoctors(specialization);
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
      });
  },
});

export default userSlice.reducer;