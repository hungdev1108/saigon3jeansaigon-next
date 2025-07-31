import type { Metadata } from "next";
import { Montserrat, Merriweather } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/styles.css";
import "../styles/facility-slider.css";
import "../styles/eco-friendly-unified.css";
import "../styles/eco-friendly-override.css";
import "../styles/eco-friendly-responsive.css";
import "../styles/eco-friendly-important.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import ClientScriptProvider from "../components/ClientScriptProvider";

const montserrat = Montserrat({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const merriweather = Merriweather({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
});

export const metadata: Metadata = {
  title: "Saigon 3 Jean",
  description: "Leading garment manufacturer in Vietnam",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Saigon 3 Jean" />
        <meta
          name="keywords"
          content="Saigon 3 Jean, Fashion, Manufacturing, Vietnam"
        />
        <meta name="author" content="Saigon 3 Jean" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="google" content="notranslate" />
        <meta
          name="google-site-verification"
          content="google-site-verification=google-site-verification"
        />
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${montserrat.className} ${merriweather.variable}`} suppressHydrationWarning>
        <ClientScriptProvider />
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
