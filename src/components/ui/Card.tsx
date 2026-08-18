import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  href?: string;
}

export function Card({ children, className = '', href }: CardProps) {
  const base = `rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] ${className}`;

  if (href) {
    return (
      <a href={href} className={`${base} block hover:border-[var(--color-primary)] transition-colors`}>
        {children}
      </a>
    );
  }

  return <div className={base}>{children}</div>;
}
