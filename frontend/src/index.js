import React from 'react';
import { createRoot } from 'react-dom/client';
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";

import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import "../src/index.css";

const queryClient = new QueryClient();

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
