import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | FireDNS Dashboard',
    default: 'FireDNS Dashboard',
  },
  description: 'FireDNS, a dns based firewall.',
  metadataBase: new URL('https://www.brachi.me'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
