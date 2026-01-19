import { ReactNode } from 'react';

interface MatchSectionProps {
  title: string;
  children: ReactNode;
  emptyMessage: string;
  isEmpty: boolean;
}

export function MatchSection({ title, children, emptyMessage, isEmpty }: MatchSectionProps) {
  return (
    <div className="px-4 pb-6">
      <h2 className="text-xl font-semibold mb-3 px-2 dark:text-white">{title}</h2>
      {isEmpty ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </div>
  );
}
