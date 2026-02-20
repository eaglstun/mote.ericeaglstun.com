import React, { useState } from 'react';
import FileTree from './components/FileTree';
import MarkdownViewer from './components/MarkdownViewer';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: 260, borderRight: '1px solid #ddd', flexShrink: 0, overflowY: 'auto' }}>
        <FileTree onSelect={setSelectedFile} />
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <MarkdownViewer filePath={selectedFile} />
      </div>
    </div>
  );
}

export default App;
