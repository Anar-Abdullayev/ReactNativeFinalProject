import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const loadProfile = createAsyncThunk("profile/load", async () => {
  const storedName = await AsyncStorage.getItem("userProfile");
  if (storedName) {
    const profile = JSON.parse(storedName);
    return profile.name;
  }
  return null;
});

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    name: "Guest",
    hasProfile: false,
    loading: true,
  },
  reducers: {
    setProfile: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      state.hasProfile = true;
    },
    logoutProfile: (state) => {
      state.name = '';
      state.hasProfile = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadProfile.pending, (state, action) => {
      state.loading = true;
    })
    builder.addCase(loadProfile.fulfilled, (state, action: PayloadAction<string | null>) => {
      let profileName = action.payload ? action.payload : 'Guest';
      state.hasProfile = action.payload !== null
      state.name = profileName;
      state.loading = false;
    });
  },
});

export const { setProfile, logoutProfile } = profileSlice.actions;
export default profileSlice.reducer;
