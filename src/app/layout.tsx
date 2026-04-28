import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Metadata } from 'next';
import { SettingProvider } from '@/context/SettingContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { PreloaderProvider } from '@/context/PreloaderContext';

const outfit = Outfit({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title:
    "Dashboard | Feel Safe Private Limited",
  description: "Feel Safe Private Limited Description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <PreloaderProvider>
            <AuthProvider>
              <SettingProvider>
                <NotificationProvider>
                  <SidebarProvider>{children}</SidebarProvider>
                </NotificationProvider>
              </SettingProvider>
            </AuthProvider>
          </PreloaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
