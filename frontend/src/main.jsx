import React from "react";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";
import { ToastContainer } from "react-toastify";

import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import "../src/index.css";

import { createRoot } from "react-dom/client";

const queryClient = new QueryClient();

const localStoragePersistor = createWebStoragePersistor({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persistor: localStoragePersistor,
  // Invalidates every visiting browser's persisted cache on each new deploy --
  // without this, a stale cached response (e.g. an old /api/systemInfo) can
  // silently survive in localStorage for up to 24h (persistQueryClient's
  // default maxAge) even across a hard refresh, since the persisted cache is
  // otherwise considered "fresh" and no network refetch ever happens.
  buster: import.meta.env.VITE_COMMIT_HASH,
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
