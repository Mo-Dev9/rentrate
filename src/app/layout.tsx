import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RentRate — تقييم الشقق والمباني في مصر',
  description: 'اكتشف تقييمات الشقق والمباني السكنية قبل التوقيع. تقييمات حقيقية من سكان حقيقيين.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
