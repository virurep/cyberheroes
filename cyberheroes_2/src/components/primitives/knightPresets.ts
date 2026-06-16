/* Knight sprite color presets — shared by Knight, DialogueBox, ConvoTurn, etc. */

export type KnightColor = 'cyan' | 'purple' | 'green' | 'red' | 'gold' | 'white';

export interface KnightPreset {
  rgb: string;
  filter: string;
}

export const KNIGHT_PRESETS: Record<KnightColor, KnightPreset> = {
  cyan: { rgb: '0,180,255', filter: 'brightness(1.4) contrast(1.1)' },
  purple: {
    rgb: '160,80,255',
    filter: 'brightness(1.3) contrast(1.1) hue-rotate(195deg) saturate(1.4)',
  },
  green: {
    rgb: '0,255,120',
    filter: 'brightness(1.4) contrast(1.1) hue-rotate(100deg) saturate(1.3)',
  },
  red: {
    rgb: '255,60,80',
    filter: 'brightness(1.4) contrast(1.1) hue-rotate(300deg) saturate(1.5)',
  },
  gold: {
    rgb: '255,200,0',
    filter: 'brightness(1.5) contrast(1.1) hue-rotate(248deg) saturate(1.6)',
  },
  white: { rgb: '200,220,255', filter: 'brightness(1.8) contrast(0.9) saturate(0.1)' },
};
