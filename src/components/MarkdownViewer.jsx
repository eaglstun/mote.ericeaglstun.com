import { useState, useEffect, useMemo } from "react";
import Markdown from "react-markdown";

function resolveHref(filePath, href) {
  if (!href || href.startsWith("http://") || href.startsWith("https://")) {
    return { url: href, isInternal: false };
  }
  const dir = filePath.substring(0, filePath.lastIndexOf("/") + 1);
  const parts = (dir + href).split("/");
  const resolved = [];
  for (const part of parts) {
    if (part === "..") resolved.pop();
    else if (part && part !== ".") resolved.push(part);
  }
  const path = resolved.join("/");
  if (path.endsWith(".md")) {
    return { url: path, isInternal: true };
  }
  if (!path.includes(".")) {
    return { url: path, isInternal: true };
  }
  return { url: `/content/${path}`, isInternal: false };
}

export default function MarkdownViewer({ filePath, onNavigate }) {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!filePath) {
      setContent("");
      return;
    }
    fetch(`/content/${filePath}`)
      .then((res) => res.text())
      .then(setContent)
      .catch(console.error);
  }, [filePath]);

  const components = useMemo(
    () => ({
      a({ href, children }) {
        const { url, isInternal } = resolveHref(filePath, href);
        if (isInternal) {
          return (
            <a
              href={`/${url}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(url);
              }}
            >
              {children}
            </a>
          );
        }
        return <a href={url}>{children}</a>;
      },
      img({ src, alt }) {
        const { url } = resolveHref(filePath, src);
        return <img src={url} alt={alt} />;
      },
    }),
    [filePath, onNavigate],
  );

  if (!filePath) {
    return (
      <div className="markdown-viewer--empty">
        Select a file to view its contents.
      </div>
    );
  }

  return (
    <div className="markdown-viewer">
      <Markdown components={components}>{content}</Markdown>
    </div>
  );
}
