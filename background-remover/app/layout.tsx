import { Metadata } from 'next';
import { defaultMetadata } from './metadata';
import './globals.css';
import Footer from './components/shared/layout/Footer';
import { Roboto_Mono } from 'next/font/google';

export const metadata: Metadata = defaultMetadata;
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`min-h-screen bg-gray-50 ${robotoMono.className}`}>
        <div className="flex flex-col min-h-screen">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
