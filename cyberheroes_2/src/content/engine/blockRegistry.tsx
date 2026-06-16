/* eslint-disable react-refresh/only-export-components --
   This file intentionally pairs each small renderer with the BLOCK_RENDERERS lookup table
   (the registry pattern this engine is built around) rather than fragmenting into one
   component per file. That trades a clean Fast Refresh boundary — a dev-experience nicety —
   for keeping "the type, its renderer, and its registration" readable together. */
import type { ComponentType } from 'react';
import { LessonText } from '../../components/lesson/LessonText';
import { TextBox } from '../../components/textboxes/TextBox';
import { DialogueBox } from '../../components/textboxes/DialogueBox';
import { KeyTerm } from '../../components/textboxes/KeyTerm';
import { QuoteBox } from '../../components/textboxes/QuoteBox';
import { StepBox } from '../../components/textboxes/StepBox';
import { InlineCode } from '../../components/primitives/InlineCode';
import { renderRichText } from './richText';
import type {
  Block,
  BlockType,
  CodeBlock,
  DialogueBlock,
  ImageBlock,
  KeyTermBlock,
  QuoteBlock,
  StepBlock,
  TextBlock,
  TextBoxBlock,
} from './types';

export interface BlockProps<B extends Block = Block> {
  block: B;
}

function TextBlockRenderer({ block }: BlockProps<TextBlock>) {
  return <LessonText>{renderRichText(block.content)}</LessonText>;
}

function TextBoxBlockRenderer({ block }: BlockProps<TextBoxBlock>) {
  return (
    <TextBox type={block.boxType} title={block.title}>
      {renderRichText(block.content)}
    </TextBox>
  );
}

function DialogueBlockRenderer({ block }: BlockProps<DialogueBlock>) {
  return (
    <DialogueBox speaker={block.speaker} knightColor={block.knightColor} side={block.side}>
      {renderRichText(block.content)}
    </DialogueBox>
  );
}

function KeyTermBlockRenderer({ block }: BlockProps<KeyTermBlock>) {
  return <KeyTerm term={block.term}>{renderRichText(block.content)}</KeyTerm>;
}

function QuoteBlockRenderer({ block }: BlockProps<QuoteBlock>) {
  return <QuoteBox author={block.author}>{renderRichText(block.content)}</QuoteBox>;
}

function StepBlockRenderer({ block }: BlockProps<StepBlock>) {
  return (
    <StepBox step={block.step} total={block.total} title={block.title}>
      {renderRichText(block.content)}
    </StepBox>
  );
}

function CodeBlockRenderer({ block }: BlockProps<CodeBlock>) {
  return <InlineCode>{block.content}</InlineCode>;
}

function ImageBlockRenderer({ block }: BlockProps<ImageBlock>) {
  return (
    <figure style={{ margin: 0 }}>
      <img src={block.src} alt={block.alt ?? ''} style={{ maxWidth: '100%', display: 'block', imageRendering: 'pixelated' }} />
      {block.caption && (
        <figcaption style={{ fontSize: 8, color: 'var(--dim)', letterSpacing: 1, marginTop: 8 }}>{block.caption}</figcaption>
      )}
    </figure>
  );
}

/**
 * Block-type registry. To add a new block type:
 *   1. Add the type to `BlockType` / the `Block` union in ./types.ts
 *      (and a matching branch in the zod schema in ./schemas.ts).
 *   2. Write a renderer component here, typed `BlockProps<YourBlock>`.
 *   3. Register it below.
 */
export const BLOCK_RENDERERS: Record<BlockType, ComponentType<BlockProps<never>>> = {
  text: TextBlockRenderer as ComponentType<BlockProps<never>>,
  textbox: TextBoxBlockRenderer as ComponentType<BlockProps<never>>,
  dialogue: DialogueBlockRenderer as ComponentType<BlockProps<never>>,
  keyterm: KeyTermBlockRenderer as ComponentType<BlockProps<never>>,
  quote: QuoteBlockRenderer as ComponentType<BlockProps<never>>,
  step: StepBlockRenderer as ComponentType<BlockProps<never>>,
  code: CodeBlockRenderer as ComponentType<BlockProps<never>>,
  image: ImageBlockRenderer as ComponentType<BlockProps<never>>,
};
