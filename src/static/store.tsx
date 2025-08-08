import { configureStore, createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    dashboardIndex: "overview",
    notification: [],
  },
  reducers: {
    _setDashbordIndex: (state, value) => {
      const newValue = value.payload;
      state.dashboardIndex = newValue;
    },
  },
});

const setDashbordIndex = (value: string) => {
  if (value === "" || value === null) value = "overview";
  window.history.replaceState(null, "", value);
  store.dispatch(appSlice.actions._setDashbordIndex(value));
};

export { setDashbordIndex };

const dataSlice = createSlice({
  name: "data",
  initialState: {
    statistics: {},
    persons: { data: [] },
    companies: { data: [] },
    contractors: { data: [] },
    payments: { data: [] },
  },
  reducers: {
    _setStatistics: (state, value) => {
      const newValue = value.payload;
      state.statistics = newValue;
    },
    _setPersons: (state, value) => {
      const newValue = value.payload;
      state.persons = newValue;
    },
    _setCompanies: (state, value) => {
      const newValue = value.payload;
      state.companies = newValue;
    },
    _setContractors: (state, value) => {
      const newValue = value.payload;
      state.contractors = newValue;
    },
    _setPayments: (state, value) => {
      const newValue = value.payload;
      state.payments = newValue;
    },
  },
});

const setStatistics = (value: any) => {
  store.dispatch(dataSlice.actions._setStatistics(value));
};
const setPersons = (value: any) => {
  store.dispatch(dataSlice.actions._setPersons(value));
};
const setCompanies = (value: any) => {
  store.dispatch(dataSlice.actions._setCompanies(value));
};
const setContractors = (value: any) => {
  store.dispatch(dataSlice.actions._setContractors(value));
};
const setPayments = (value: any) => {
  store.dispatch(dataSlice.actions._setPayments(value));
};

export { setStatistics };
export { setPersons, setCompanies, setContractors, setPayments };

const store = configureStore({
  reducer: { app: appSlice.reducer, data: dataSlice.reducer },
});

export { store };
