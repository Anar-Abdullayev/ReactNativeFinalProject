import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// const name = await AsyncStorage.getItem('userProfile');
// const getName = await AsyncStorage.getItem('userProfile');

export const loadProfile = createAsyncThunk("profile/load", async () => {
  const storedName = await AsyncStorage.getItem("userProfile");
  if (storedName) {
    const profile = JSON.parse(storedName);
    return profile.name;
  }
  return "Guest";
});

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    name: "Guest",
  },
  reducers: {
    setProfile: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadProfile.fulfilled, (state, action) => {
        state.name = action.payload;
    });
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
