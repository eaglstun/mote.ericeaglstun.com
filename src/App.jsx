import React, { useState, useEffect, useCallback } from 'react';
import FileTree from './components/FileTree';
import MarkdownViewer from './components/MarkdownViewer';

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
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: 260, borderRight: '1px solid #ddd', flexShrink: 0, overflowY: 'auto' }}>
        <FileTree onSelect={selectFile} selectedFile={selectedFile} />
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <MarkdownViewer filePath={selectedFile} />
      </div>
    </div>
  );
}

export default App;
