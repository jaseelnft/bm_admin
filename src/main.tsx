import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { store } from "./static/store.tsx";
import { Provider } from "react-redux";
import Toast from "./components/toast.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toast />
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
