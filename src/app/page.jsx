"use client";

import {
  GraduationCap,
  Users,
  BarChart3,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Bell,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">
                Student Manager
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-white/90 hover:text-white transition-colors font-medium"
              >
                Tính năng
              </a>
              <a
                href="#about"
                className="text-white/90 hover:text-white transition-colors font-medium"
              >
                Giới thiệu
              </a>
              <a
                href="#contact"
                className="text-white/90 hover:text-white transition-colors font-medium"
              >
                Liên hệ
              </a>
              <a
                href="/login"
                className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-white/90 transition-colors"
              >
                Đăng nhập
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Nền tảng Quản lý
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {" "}
                  Sinh viên
                </span>{" "}
                Thông minh
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Giải pháp công nghệ tiên tiến cho việc quản lý sinh viên toàn
                diện. Tối ưu hóa quy trình hành chính, nâng cao chất lượng đào
                tạo và trải nghiệm học tập.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/login"
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-all hover:scale-105 flex items-center justify-center group"
                >
                  Truy cập hệ thống
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#features"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all hover:scale-105 flex items-center justify-center"
                >
                  Khám phá tính năng
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-2xl p-6 text-center">
                    <Users className="h-12 w-12 text-white mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">1000+</div>
                    <div className="text-white/80 text-sm">Sinh viên</div>
                  </div>
                  <div className="bg-white/20 rounded-2xl p-6 text-center">
                    <BarChart3 className="h-12 w-12 text-white mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-white/80 text-sm">Lớp học</div>
                  </div>
                  <div className="bg-white/20 rounded-2xl p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-white mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">99%</div>
                    <div className="text-white/80 text-sm">Độ chính xác</div>
                  </div>
                  <div className="bg-white/20 rounded-2xl p-6 text-center">
                    <Star className="h-12 w-12 text-white mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-white/80 text-sm">Hỗ trợ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Tính năng vượt trội
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Khám phá hệ sinh thái tính năng toàn diện, được thiết kế để tối
                ưu hóa hiệu quả quản lý giáo dục
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Quản lý hồ sơ sinh viên",
                  description:
                    "Hệ thống lưu trữ và quản lý thông tin sinh viên toàn diện với bảo mật cao và khả năng truy xuất nhanh chóng.",
                  color: "bg-blue-500",
                },
                {
                  icon: BarChart3,
                  title: "Theo dõi học tập & đánh giá",
                  description:
                    "Giám sát tiến độ học tập, quản lý kết quả đánh giá với hệ thống báo cáo chi tiết và phân tích chuyên sâu.",
                  color: "bg-green-500",
                },
                {
                  icon: Calendar,
                  title: "Quản lý lịch trình học tập",
                  description:
                    "Tối ưu hóa việc sắp xếp thời khóa biểu, quản lý hoạt động học thuật và ngoại khóa một cách khoa học.",
                  color: "bg-purple-500",
                },
                {
                  icon: TrendingUp,
                  title: "Phân tích & báo cáo thông minh",
                  description:
                    "Tạo lập báo cáo đa chiều và phân tích dữ liệu chuyên sâu để hỗ trợ ra quyết định chiến lược.",
                  color: "bg-orange-500",
                },
                {
                  icon: AlertTriangle,
                  title: "Quản lý kỷ luật & vi phạm",
                  description:
                    "Theo dõi, xử lý các vấn đề kỷ luật một cách minh bạch, công bằng và tuân thủ quy định.",
                  color: "bg-red-500",
                },
                {
                  icon: Bell,
                  title: "Hệ thống thông báo tự động",
                  description:
                    "Cơ chế thông báo thông minh, đảm bảo truyền tải thông tin kịp thời và chính xác đến mọi đối tượng.",
                  color: "bg-indigo-500",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  <div
                    className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Hiệu quả được chứng minh
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Những chỉ số thực tế khẳng định độ tin cậy và hiệu quả vượt trội
                của hệ thống
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  number: "1000+",
                  label: "Sinh viên được quản lý",
                  icon: Users,
                },
                {
                  number: "50+",
                  label: "Khoa/Ngành đào tạo",
                  icon: GraduationCap,
                },
                {
                  number: "99%",
                  label: "Độ tin cậy hệ thống",
                  icon: CheckCircle,
                },
                { number: "24/7", label: "Hỗ trợ kỹ thuật", icon: Star },
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-white/20 rounded-2xl p-6 mb-4 group-hover:bg-white/30 transition-colors">
                    <stat.icon className="h-12 w-12 text-white mx-auto mb-4" />
                    <div className="text-4xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-white/90 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-white/20 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-8 w-8 text-white" />
                <span className="text-xl font-bold text-white">
                  Student Manager
                </span>
              </div>
              <p className="text-white/80 leading-relaxed">
                Nền tảng quản lý sinh viên hàng đầu, cung cấp giải pháp công
                nghệ toàn diện cho các tổ chức giáo dục trong kỷ nguyên chuyển
                đổi số.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Điều hướng
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Truy cập hệ thống", href: "/login" },
                  { label: "Tính năng", href: "#features" },
                  { label: "Về chúng tôi", href: "#about" },
                  { label: "Liên hệ", href: "#contact" },
                ].map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="block text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Hỗ trợ khách hàng
              </h3>
              <div className="space-y-2 text-white/80">
                <p>Email: support@studentmanager.com</p>
                <p>Hotline: (84) 123-456-789</p>
                <p>Địa chỉ: 322E, Phường Phương Liệt, Thành phố Hà Nội</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/60">
              &copy; 2024 Student Manager. Bảo lưu mọi quyền sở hữu trí tuệ.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
