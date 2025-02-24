import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./assets/css/tailwind.output.css";
import App from "./App";
import { SidebarProvider } from "./context/SidebarContext";
import ThemedSuspense from "./components/ThemedSuspense";
import { Windmill } from "@windmill/react-ui";
import windmillTheme from "./windmillTheme";
import "./styles/quill.css";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";

// import { applySecurityHeaders } from './middleware/security';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Apply security headers
// applySecurityHeaders();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      suspense: false,
      networkMode: "offlineFirst",
      gcTime: 10 * 60 * 1000,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.error(`Something went wrong: ${error.message}`);
    },
  }),
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <SidebarProvider>
          <Suspense fallback={<ThemedSuspense />}>
            <Windmill usePreferences theme={windmillTheme}>
              <App />
            </Windmill>
          </Suspense>
        </SidebarProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);

// Register service worker
// serviceWorker.register({
//   onUpdate: registration => {
//     const waitingServiceWorker = registration.waiting;

//     if (waitingServiceWorker) {
//       waitingServiceWorker.addEventListener("statechange", event => {
//         if (event.target.state === "activated") {
//           window.location.reload();
//         }
//       });
//       waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
//     }
//   }
// });
