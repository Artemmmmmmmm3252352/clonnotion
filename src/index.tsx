import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/Home";
import { ProjectsPage } from "./pages/Projects";
import { TasksDBPage } from "./pages/TasksDB";
import { NotesDBPage } from "./pages/NotesDB";
import { ArchivePage } from "./pages/Archive";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="tasks" element={<TasksDBPage />} />
          <Route path="notes" element={<NotesDBPage />} />
          <Route path="archive" element={<ArchivePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
