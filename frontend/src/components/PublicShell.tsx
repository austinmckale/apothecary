import { ReactNode } from 'react';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

type PublicShellProps = {
  children: ReactNode;
};

export default function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}

