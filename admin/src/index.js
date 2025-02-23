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
} from 'chart.js';
import "./assets/css/tailwind.output.css";
import App from "./App";
import { SidebarProvider } from "./context/SidebarContext";
import ThemedSuspense from "./components/ThemedSuspense";
import { Windmill } from "@windmill/react-ui";
import windmillTheme from "./windmillTheme";
import './styles/quill.css';

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

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <SidebarProvider>
    <Suspense fallback={<ThemedSuspense />}>
      <Windmill usePreferences theme={windmillTheme}>
        <App />
      </Windmill>
    </Suspense>
  </SidebarProvider>
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
