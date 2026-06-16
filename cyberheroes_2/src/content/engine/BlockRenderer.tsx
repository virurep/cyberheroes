import type { ComponentType } from 'react';
import { TextBox } from '../../components/textboxes/TextBox';
import { BLOCK_RENDERERS } from './blockRegistry';
import type { Block } from './types';

export interface BlockRendererProps {
  block: Block;
}

/** Looks up the renderer for a block's `type` in BLOCK_RENDERERS; renders a visible dev error if missing. */
export function BlockRenderer({ block }: BlockRendererProps) {
  // The registry is keyed by a discriminated union, so each entry's prop type is narrower than
  // `Block` — safe in practice (we always look up by that exact `type`), but TS can't prove it
  // through the Record index. Widen once here, at the single call site, rather than at every renderer.
  const Renderer = BLOCK_RENDERERS[block.type] as ComponentType<{ block: Block }> | undefined;
  if (!Renderer) {
    return (
      <TextBox type="danger" title="UNKNOWN BLOCK TYPE">
        Block has type <code>{block.type}</code>, which has no registered renderer. Add one in{' '}
        <code>src/content/engine/blockRegistry.tsx</code>.
      </TextBox>
    );
  }
  return <Renderer block={block} />;
}
