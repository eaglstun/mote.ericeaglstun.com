import { useState, useEffect } from 'react';

function DirectoryNode({ node, path, onSelect, selectedFile }) {
  const containsSelected = selectedFile && selectedFile.startsWith(path + '/');
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
            <TreeNode key={child.name} node={child} parentPath={path} onSelect={onSelect} selectedFile={selectedFile} />
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

function TreeNode({ node, parentPath, onSelect, selectedFile }) {
  const path = parentPath ? parentPath + '/' + node.name : node.name;
  if (node.type === 'directory') {
    return <DirectoryNode node={node} path={path} onSelect={onSelect} selectedFile={selectedFile} />;
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
          <TreeNode key={node.name} node={node} parentPath="" onSelect={onSelect} selectedFile={selectedFile} />
        ))}
      </ul>
    </nav>
  );
}
