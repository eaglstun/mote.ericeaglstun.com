import { useState, useEffect } from 'react';

function DirectoryNode({ node, onSelect, selectedFile }) {
  const containsSelected = selectedFile && selectedFile.startsWith(node.name + '/');
  const [expanded, setExpanded] = useState(containsSelected);

  useEffect(() => {
    if (containsSelected) setExpanded(true);
  }, [containsSelected]);

  return (
    <li>
      <span className="file-tree__toggle" onClick={() => setExpanded(!expanded)}>
        {expanded ? '▼' : '▶'} {node.name}
      </span>
      {expanded && (
        <ul className="file-tree__children">
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
  const className = `file-tree__file${isActive ? ' file-tree__file--active' : ''}`;

  return (
    <li>
      <span className={className} onClick={() => onSelect(node.path)}>
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
    <nav className="file-tree">
      <ul className="file-tree__list">
        {tree.map((node) => (
          <TreeNode key={node.name} node={node} onSelect={onSelect} selectedFile={selectedFile} />
        ))}
      </ul>
    </nav>
  );
}
