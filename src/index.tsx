import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { WorkspaceProvider } from "./store";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/Home";
import { PageEditorPage } from "./pages/PageEditor";
import { SearchPage } from "./pages/Search";
import { TrashPage } from "./pages/Trash";
import { DatabasePage } from "./pages/Database";
import { InboxPage } from "./pages/Inbox";
import { SettingsPage } from "./pages/Settings";
import { LoginPage, RegisterPage, ForgotPasswordPage } from "./pages/Auth";

const App = () => {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

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
