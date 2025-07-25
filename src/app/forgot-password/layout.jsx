import "./globals.css";

export const metadata = {
  title: "Quên mật khẩu",
  description: "Quên mật khẩu hệ thống",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
