import type { ReactNode } from 'react';
import { InlineCode } from '../../components/primitives/InlineCode';

/**
 * Tiny inline-emphasis mini-syntax so JSON strings can carry the same
 * colored spans / inline-code the JSX prototypes used directly.
 *
 *   {{gold:word}}    -> <span style={{color:'var(--gold)'}}>word</span>
 *   {{cyan:word}}    -> ...
 *   {{red:word}}     -> ...
 *   {{green:word}}   -> ...
 *   {{purple:word}}  -> ...
 *   {{code:TEXT}}    -> <InlineCode>TEXT</InlineCode>
 *   plain text       -> passed through unchanged
 *
 * Deliberately NOT a general markup language: no nesting, no raw HTML
 * injection. We tokenize the string and map tokens straight to React
 * elements/strings — nothing here is ever interpreted as markup.
 */

const COLOR_TOKENS = ['gold', 'cyan', 'red', 'green', 'purple'] as const;
type ColorToken = (typeof COLOR_TOKENS)[number];

const TOKEN_RE = /\{\{(gold|cyan|red|green|purple|code):([^{}]*)\}\}/g;

function isColorToken(tag: string): tag is ColorToken {
  return (COLOR_TOKENS as readonly string[]).includes(tag);
}

export function renderRichText(content: string | null | undefined): ReactNode {
  if (!content) return null;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of content.matchAll(TOKEN_RE)) {
    const [whole, tag, inner] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(content.slice(lastIndex, index));
    }
    if (tag === 'code') {
      nodes.push(<InlineCode key={key++}>{inner}</InlineCode>);
    } else if (isColorToken(tag)) {
      nodes.push(
        <span key={key++} style={{ color: `var(--${tag})` }}>
          {inner}
        </span>,
      );
    } else {
      // Unknown tag — keep raw text rather than silently dropping content.
      nodes.push(whole);
    }
    lastIndex = index + whole.length;
  }

  if (lastIndex < content.length) {
    nodes.push(content.slice(lastIndex));
  }

  return nodes;
}
