import type { ReactNode } from 'react';

export interface LessonBodyProps {
  children?: ReactNode;
}

export function LessonBody({ children }: LessonBodyProps) {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {children}
    </div>
  );
}
