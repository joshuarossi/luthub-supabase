import { Inter } from 'next/font/google';
import './globals.css';
import Nav from '../components/Nav';
import { AuthProvider } from '../context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LUTHub',
  description: 'A platform to upload, view, and manage your images.',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AuthProvider>
          <Nav />
          <main className='container mx-auto p-4'>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
