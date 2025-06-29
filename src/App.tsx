import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import FocusPage from "./pages/FocusPage";
import JournalPage from "./pages/JournalPage";
import SettingsPage from "./pages/SettingsPage";
import LandingPage from "./pages/LandingPage";
import AppLayout from "./components/AppLayout";
import LoadingScreen from "./components/LoadingScreen";
import { SettingsProvider } from "./hooks/useSettings";
import { useAuth } from "./hooks/useAuth";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  // Show loading state while auth is being determined
  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  // Redirect to landing if not authenticated
  return user ? <>{children}</> : <Navigate to="/" replace />;
};

// App Routes Component
const AppRoutes = () => {
  const { user, loading } = useAuth();

  // Show loading state while auth is being determined
  if (loading) {
    return <LoadingScreen message="Loading Clarity..." />;
  }

  return (
    <Routes>
      {/* Public Routes - No AppLayout */}
      <Route path="/" element={<LandingPage />} />

      {/* Protected Routes - Wrapped in AppLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/focus"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FocusPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal"
        element={
          <ProtectedRoute>
            <AppLayout>
              <JournalPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirect authenticated users to dashboard, others to landing */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <SettingsProvider>
        <AppRoutes />
      </SettingsProvider>
    </BrowserRouter>
  );
}
