import type { ReactNode } from 'react';

type SectionProps = {
  children: ReactNode;
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
  action?: ReactNode;
  tone?: 'light' | 'dark' | 'muted';
  className?: string;
  containerClassName?: string;
};

export function Section({
  children,
  eyebrow,
  title,
  description,
  action,
  tone = 'light',
  className = '',
  containerClassName = '',
}: SectionProps) {
  const toneClasses =
    tone === 'dark'
      ? 'bg-slate-950 text-white'
      : tone === 'muted'
      ? 'bg-gray-50 text-gray-900'
      : 'bg-white text-gray-900';

  const eyebrowColor = tone === 'dark' ? 'text-violet-400' : 'text-violet-600';
  const descColor = tone === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <section className={`${toneClasses} ${className}`}>
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 ${containerClassName}`}
      >
        {(eyebrow || title || action) && (
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              {eyebrow && (
                <p className={`text-xs font-semibold uppercase tracking-[0.18em] mb-3 ${eyebrowColor}`}>
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className={`mt-3 text-base ${descColor}`}>{description}</p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}