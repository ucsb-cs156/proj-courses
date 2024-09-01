import "../src/index.css";
import "bootstrap/dist/css/bootstrap.css";
import 'react-toastify/dist/ReactToastify.css';

import { initialize, mswLoader } from 'msw-storybook-addon'

import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Initialize MSW
initialize()

export const decorators = [
  (Story) => {
    const location = useLocation();
    useEffect(() => {
      if (location.pathname !== "/") {
        toast("Would navigate to: " + location.pathname);
      }
    }, [location]);

    return <Story />;
  },
  (Story) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ToastContainer />
        <Story />
      </MemoryRouter>
    </QueryClientProvider>
  )
];


/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  loaders: [mswLoader]
};


export default preview;
