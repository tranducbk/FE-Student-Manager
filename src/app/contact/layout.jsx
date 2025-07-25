import "./globals.css";

export const metadata = {
  title: "Liên hệ với admin",
  description: "Liên hệ với admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
