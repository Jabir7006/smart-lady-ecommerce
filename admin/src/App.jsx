import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ThemedSuspense from "./components/ThemedSuspense";
import { performanceMonitor } from "./services/performanceMonitoring";

const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
// const CreateAccount = lazy(() => import("./pages/CreateAccount"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

// Add performance observer
performanceMonitor.addObserver((data) => {
  if (data.duration > 1000) {
    // Alert for operations taking longer than 1 second
    console.warn(
      `Slow operation detected: ${data.name} took ${data.duration}ms`
    );
  }
});

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
        <Suspense fallback={<ThemedSuspense />}>
          <AccessibleNavigationAnnouncer />
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* <Route path="/create-account" element={<CreateAccount />} /> */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/app/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
