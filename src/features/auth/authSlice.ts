import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  username: string | null;
}

const initialState: AuthState = {
  // Note: a real app would probably have more complex auth state,
  // but for this example we'll keep things simple
  username: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoggedIn(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    userLoggedOut(state) {
      state.username = null;
    },
  },
  selectors: {
    selectCurrentUsername: (authState) => authState.username,
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;

export const { selectCurrentUsername } = authSlice.selectors;

export default authSlice.reducer;
