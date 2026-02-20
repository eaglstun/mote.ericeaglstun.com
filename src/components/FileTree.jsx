import React, { useState, useEffect } from 'react';

function DirectoryNode({ node, onSelect, selectedFile }) {
  const containsSelected = selectedFile && selectedFile.startsWith(node.name + '/');
  const [expanded, setExpanded] = useState(containsSelected);

  useEffect(() => {
    if (containsSelected) setExpanded(true);
  }, [containsSelected]);

  return (
    <li>
      <span
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        {expanded ? '▼' : '▶'} {node.name}
      </span>
      {expanded && (
        <ul style={{ listStyle: 'none', paddingLeft: 16 }}>
          {node.children.map((child) => (
            <TreeNode key={child.name} node={child} onSelect={onSelect} selectedFile={selectedFile} />
          ))}
        </ul>
      )}
    </li>
  );
}

function FileNode({ node, onSelect, selectedFile }) {
  const isActive = selectedFile === node.path;
  return (
    <li>
      <span
        onClick={() => onSelect(node.path)}
        style={{
          cursor: 'pointer',
          userSelect: 'none',
          fontWeight: isActive ? 'bold' : 'normal',
        }}
      >
        📄 {node.name}
      </span>
    </li>
  );
}

function TreeNode({ node, onSelect, selectedFile }) {
  if (node.type === 'directory') {
    return <DirectoryNode node={node} onSelect={onSelect} selectedFile={selectedFile} />;
  }
  return <FileNode node={node} onSelect={onSelect} selectedFile={selectedFile} />;
}

export default function FileTree({ onSelect, selectedFile }) {
  const [tree, setTree] = useState([]);

  useEffect(() => {
    fetch('/manifest.json')
      .then((res) => res.json())
      .then((data) => setTree(data.tree))
      .catch(console.error);
  }, []);

  return (
    <nav style={{ padding: 16, overflowY: 'auto' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {tree.map((node) => (
          <TreeNode key={node.name} node={node} onSelect={onSelect} selectedFile={selectedFile} />
        ))}
      </ul>
    </nav>
  );
}
