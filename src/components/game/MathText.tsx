import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { splitMath } from "@/lib/gamification/math-text";
import { cn } from "@/lib/utils";

/**
 * Text with maths: $…$ for inline maths and $$…$$ for a line of its own, rendered with KaTeX.
 * KaTeX escapes everything it outputs and "trust" stays off, so pasted text cannot run code.
 */
export function MathText({ text, className }: { text: string; className?: string }) {
  const parts = useMemo(() => splitMath(text), [text]);
  return (
    <div className={cn("whitespace-pre-wrap break-words leading-relaxed", className)}>
      {parts.map((p, i) =>
        p.kind === "text" ? (
          <span key={i}>{p.value}</span>
        ) : (
          <span
            key={i}
            className={p.display ? "my-2 block overflow-x-auto text-center" : undefined}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(p.value, {
                displayMode: p.display,
                throwOnError: false,
                trust: false,
                strict: "ignore",
                maxSize: 20,
                maxExpand: 200,
              }),
            }}
          />
        ),
      )}
    </div>
  );
}
