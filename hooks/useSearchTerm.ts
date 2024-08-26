import { create } from "zustand";
interface searchTerm {
  title: string | undefined;
  country: string | undefined;
  state: string | undefined;
  city: string | undefined;
  setCountry: (country: string) => void;
  setState: (state: string) => void;
  setCity: (city: string) => void;
  setTitle: (title: string) => void;
  resetAll: () => void;
}
const useSearchTerm = create<searchTerm>((set) => ({
  title: undefined,
  country: undefined,
  state: undefined,
  city: undefined,
  setTitle: (title: string) => {
    set({ title: title });
  },
  setCountry: (country: string) => {
    set({ country: country });
  },
  setState: (state: string) => {
    set({ state: state });
  },
  setCity: (city: string) => {
    set({ city: city });
  },
  resetAll: () => {
    set({
      title: undefined,
      country: undefined,
      state: undefined,
      city: undefined,
    });
  },
}));
export default useSearchTerm;
