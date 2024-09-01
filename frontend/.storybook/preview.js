import "../src/index.css";
import "bootstrap/dist/css/bootstrap.css";
import 'react-toastify/dist/ReactToastify.css';

import { initialize, mswLoader } from 'msw-storybook-addon'

import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

// Initialize MSW
initialize()

export const decorators = [
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
