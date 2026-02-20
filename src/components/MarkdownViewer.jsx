import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

export default function MarkdownViewer({ filePath }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!filePath) {
      setContent('');
      return;
    }
    fetch(`/content/${filePath}`)
      .then((res) => res.text())
      .then(setContent)
      .catch(console.error);
  }, [filePath]);

  if (!filePath) {
    return (
      <div style={{ padding: 16, color: '#888' }}>
        Select a file to view its contents.
      </div>
    );
  }

  return (
    <div style={{ padding: 16, overflowY: 'auto' }}>
      <Markdown>{content}</Markdown>
    </div>
  );
}
