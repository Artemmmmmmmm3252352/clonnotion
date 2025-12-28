import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { WorkspaceProvider } from "./store";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/Home";
import { PageEditorPage } from "./pages/PageEditor";
import { SearchPage } from "./pages/Search";
import { TrashPage } from "./pages/Trash";
import { DatabasePage } from "./pages/Database";
import { InboxPage } from "./pages/Inbox";
import { SettingsPage } from "./pages/Settings";
import { LoginPage, SignupPage } from "./pages/Auth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2383e2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#9b9a97]">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2383e2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#9b9a97]">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<HomePage />} />
              <Route path="page/:pageId" element={<PageEditorPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="trash" element={<TrashPage />} />
              <Route path="database/:databaseId" element={<DatabasePage />} />
              <Route path="inbox" element={<InboxPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WorkspaceProvider>
    </AuthProvider>
  );
};

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
