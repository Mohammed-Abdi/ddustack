import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';
export type Toggle = 'open' | 'close';
interface AppState {
  theme: Theme;
  sidebar: Toggle;
  searchModal: Toggle;
}

const isMobile = () => window.innerWidth <= 768;

const getInitialSidebar = (): Toggle => {
  if (isMobile()) return 'close';
  return (localStorage.getItem('sidebar') as Toggle) || 'close';
};

const getInitialTheme = (): 'light' | 'dark' => {
  return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
};

const initialState: AppState = {
  theme: getInitialTheme(),
  sidebar: getInitialSidebar(),
  searchModal: 'close',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    openSidebar(state) {
      state.sidebar = 'open';
      if (!isMobile()) localStorage.setItem('sidebar', 'open');
    },
    closeSidebar(state) {
      state.sidebar = 'close';
      if (!isMobile()) localStorage.setItem('sidebar', 'close');
    },
    toggleSidebar(state) {
      state.sidebar = state.sidebar === 'open' ? 'close' : 'open';
      if (!isMobile()) localStorage.setItem('sidebar', state.sidebar);
    },
    openSearchModal(state) {
      state.searchModal = 'open';
    },
    closeSearchModal(state) {
      state.searchModal = 'close';
    },
    toggleSearchModal(state) {
      state.searchModal = state.searchModal === 'open' ? 'close' : 'open';
    },

    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
      document.documentElement.setAttribute('data-theme', action.payload);
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
    },
  },
});

export const {
  openSidebar,
  closeSidebar,
  toggleSidebar,
  openSearchModal,
  closeSearchModal,
  toggleSearchModal,
  setTheme,
  toggleTheme,
} = appSlice.actions;

export default appSlice.reducer;
