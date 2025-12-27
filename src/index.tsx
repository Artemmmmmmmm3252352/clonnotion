import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WorkspaceProvider } from "./store";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/Home";
import { PageEditorPage } from "./pages/PageEditor";
import { SearchPage } from "./pages/Search";
import { TrashPage } from "./pages/Trash";
import { DatabasePage } from "./pages/Database";

const App = () => {
  return (
    <WorkspaceProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="page/:pageId" element={<PageEditorPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="trash" element={<TrashPage />} />
            <Route path="database/:databaseId" element={<DatabasePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WorkspaceProvider>
  );
};

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
