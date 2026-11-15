/** Splits text into plain parts and maths parts written as $…$ (inline) or $$…$$ (display). */
export type MathPart =
  { kind: "text"; value: string } | { kind: "math"; value: string; display: boolean };

export function splitMath(text: string): MathPart[] {
  const parts: MathPart[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let last = 0;
  for (let m = re.exec(text); m !== null; m = re.exec(text)) {
    if (m.index > last) parts.push({ kind: "text", value: text.slice(last, m.index) });
    const display = m[1] !== undefined;
    parts.push({ kind: "math", value: (display ? m[1] : m[2]) ?? "", display });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ kind: "text", value: text.slice(last) });
  return parts;
}
