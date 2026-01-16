import { useState } from "react";
import { Copy, Check } from "lucide-react";

const CodeBlock = ({ code, language = "javascript" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Simple syntax highlighting (you can expand this)
    const highlightCode = (code) => {
        const patterns = {
            keyword: /\b(const|let|var|function|return|if|else|for|while|import|export|default|from|class|extends)\b/g,
            string: /(["'`])(?:(?=(\\?))\2.)*?\1/g,
            comment: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
            number: /\b\d+\b/g,
        };

        let highlighted = code;

        highlighted = highlighted.replace(patterns.keyword, '<span class="keyword">$&</span>');
        highlighted = highlighted.replace(patterns.string, '<span class="string">$&</span>');
        highlighted = highlighted.replace(patterns.comment, '<span class="comment">$&</span>');
        highlighted = highlighted.replace(patterns.number, '<span class="number">$&</span>');

        return { __html: highlighted };
    };

    return (
        <div className="code-block">
            <div className="code-header">
                <span className="language-tag">{language}</span>
                <button
                    className="copy-btn"
                    onClick={handleCopy}
                    aria-label={copied ? "Copied!" : "Copy code"}
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span className="copy-text">{copied ? "Copied!" : "Copy"}</span>
                </button>
            </div>
            <pre>
                <code dangerouslySetInnerHTML={highlightCode(code)} />
            </pre>
        </div>
    );
};

export default CodeBlock;