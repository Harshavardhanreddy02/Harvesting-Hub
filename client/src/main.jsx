import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { persistor, store } from "./pages/redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { StoreProvider } from "./pages/redux/context/storeContext.jsx";
import './utils/axiosConfig.js'; // Import axios config globally

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </PersistGate>
  </Provider>
);
