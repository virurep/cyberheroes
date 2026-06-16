import type { ReactNode } from 'react';

export interface LessonTextProps {
  children?: ReactNode;
}

export function LessonText({ children }: LessonTextProps) {
  return <p style={{ fontSize: 'clamp(10px,1.3vw,12px)', color: 'var(--text)', lineHeight: 2.4, letterSpacing: 0.5 }}>{children}</p>;
}
