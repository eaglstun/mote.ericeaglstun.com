import { useState, useEffect, useCallback } from 'react';
import FileTree from './components/FileTree';
import MarkdownViewer from './components/MarkdownViewer';
import './App.css';

function filePathFromUrl() {
  const path = window.location.pathname.replace(/^\//, '');
  return path && path.endsWith('.md') ? path : null;
}

function App() {
  const [selectedFile, setSelectedFile] = useState(filePathFromUrl);

  const selectFile = useCallback((filePath) => {
    setSelectedFile(filePath);
    window.history.pushState(null, '', '/' + filePath);
  }, []);

  useEffect(() => {
    const onPopState = () => setSelectedFile(filePathFromUrl());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <div className="app">
      <div className="app__sidebar">
        <FileTree onSelect={selectFile} selectedFile={selectedFile} />
      </div>
      <div className="app__content">
        <MarkdownViewer filePath={selectedFile} />
      </div>
    </div>
  );
}

export default App;
