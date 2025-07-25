import "./globals.css";

export const metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập vào hệ thống",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
