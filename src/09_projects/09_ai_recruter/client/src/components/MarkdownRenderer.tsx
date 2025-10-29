import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({text}:{text: string}) {
    return (
        <article className="prose prose-lg mx-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </article>
      );
}
