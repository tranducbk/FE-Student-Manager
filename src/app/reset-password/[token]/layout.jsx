import "./globals.css";

export const metadata = {
  title: "Đặt lại mật khẩu",
  description: "Đặt lại mật khẩu",
};

export default function ResetPasswordLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text">
      {children}
    </div>
  );
}
