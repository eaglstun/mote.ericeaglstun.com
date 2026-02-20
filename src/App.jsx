import { useState, useEffect, useCallback } from "react";
import FileTree from "./components/FileTree";
import MarkdownViewer from "./components/MarkdownViewer";
import "./App.css";

function filePathFromUrl() {
  const path = window.location.pathname.replace(/^\//, "");
  return path && path.endsWith(".md") ? path : null;
}

function App() {
  const [selectedFile, setSelectedFile] = useState(filePathFromUrl);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectFile = useCallback((filePath) => {
    setSelectedFile(filePath);
    window.history.pushState(null, "", "/" + filePath);
    setSidebarOpen(false);
  }, []);

  useEffect(() => {
    const onPopState = () => setSelectedFile(filePathFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <div className="app">
      <button
        className="app__sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>
      <div
        className={`app__sidebar${sidebarOpen ? " app__sidebar--open" : ""}`}
      >
        <FileTree onSelect={selectFile} selectedFile={selectedFile} />
      </div>
      <div className="app__content">
        <MarkdownViewer filePath={selectedFile} />
      </div>
    </div>
  );
}

export default App;
