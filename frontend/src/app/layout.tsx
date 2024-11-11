import { AuthProvider } from '@/contexts/AuthContext';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'rc-tooltip/assets/bootstrap_white.css';
import 'react-responsive-modal/styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Trajeto Algoritmos',
  description: 'Trajeto de algoritmos para alunos e professores',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ToastContainer />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
