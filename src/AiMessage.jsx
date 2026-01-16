import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./AiMessage.css";
import CodeBlock from './components/CodeBlock'

const AiMessage = ({ text }) => {
  return (
    <div className="ai-message">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1>{children}</h1>,
          h2: ({ children }) => <h2>{children}</h2>,
          h3: ({ children }) => <h3>{children}</h3>,

          p: ({ children }) => <p>{children}</p>,

          ul: ({ children }) => <ul>{children}</ul>,
          li: ({ children }) => <li>{children}</li>,

          hr: () => <hr />,

          strong: ({ children }) => <strong>{children}</strong>,

          code({ inline, children }) {
            if (inline) {
              return <code className="inline-code">{children}</code>;
            }

            return <CodeBlock code={String(children)} />;
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default AiMessage;
