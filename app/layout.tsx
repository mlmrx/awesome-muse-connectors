import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'MuseSquare · Discover what your agent can do', description: 'An independent home for personal-agent connectors, useful workflows, and the people building them.', icons: { icon: '/favicon.svg' } };
export default function RootLayout({ children }: {
    children: React.ReactNode;
}) { return <html lang="en"><body>{children}</body></html>; }
