import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import "./globals.css";
import UserProviders from "./provider/userProvider";
import { Toaster } from "react-hot-toast";
import { ModalProvider } from "./context/modalContext";
import I18nProvider from "./provider/i18nProvider";


const neuronAngled = localFont({
  src: "./fonts/Neuron-Angled.woff",
  weight: "400 600 700",
  display: "swap",
  variable: "--font-neuronangled",
});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata = {
  title: "TryMyTires",
  description: "TryMyTires is a tire Selling E-commerce platform",
  icons: {
    icon: "/logo_b.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${neuronAngled.variable} ${poppins.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <Toaster position="top-center" reverseOrder={false} />

        <I18nProvider>
          <UserProviders>
            {children}
          </UserProviders>
        </I18nProvider>
      </body>
    </html>
  );
}
