import { AchievementProvider } from '@/contexts/AchievementContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AchievementProvider>
          {children}
        </AchievementProvider>
      </body>
    </html>
  );
} 
