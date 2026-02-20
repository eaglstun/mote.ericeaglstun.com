import { useState, useEffect } from 'react';
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
      <div className="markdown-viewer--empty">
        Select a file to view its contents.
      </div>
    );
  }

  return (
    <div className="markdown-viewer">
      <Markdown>{content}</Markdown>
    </div>
  );
}
