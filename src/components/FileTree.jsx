import React, { useState, useEffect } from 'react';

function DirectoryNode({ node, onSelect }) {
  const [expanded, setExpanded] = useState(false);

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
            <TreeNode key={child.name} node={child} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </li>
  );
}

function FileNode({ node, onSelect }) {
  return (
    <li>
      <span
        onClick={() => onSelect(node.path)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        📄 {node.name}
      </span>
    </li>
  );
}

function TreeNode({ node, onSelect }) {
  if (node.type === 'directory') {
    return <DirectoryNode node={node} onSelect={onSelect} />;
  }
  return <FileNode node={node} onSelect={onSelect} />;
}

export default function FileTree({ onSelect }) {
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
          <TreeNode key={node.name} node={node} onSelect={onSelect} />
        ))}
      </ul>
    </nav>
  );
}
