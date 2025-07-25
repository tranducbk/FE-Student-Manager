import Link from "next/link";

const Contact = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-1/2 h-screen bg-white py-16">
        <Link href="/login">
          <img
            className="mx-auto h-20 w-auto"
            src="http://localhost:3000/logo.png"
            alt="logo"
          />
        </Link>
        <div className="pl-8 font-bold mt-8 text-xl">I. LIÊN HỆ</div>
        <div className="pl-8">
          <div className="font-bold">1. Liên hệ trực tiếp</div>
          <ul>
            <li className="text-sm">
              *Gặp trực tiếp chỉ huy tại phòng làm việc.
            </li>
          </ul>
        </div>
        <div className="pl-8 mt-4 font-bold">2. Liên hệ gián tiếp</div>
        <ul className="pl-8">
          <li className="text-sm">*Gọi điện thoại, nhắn tin hoặc gửi email:</li>
        </ul>
        <table className="text-sm mx-8 mt-1 text-left rtl:text-righ border-collapse border border-slate-400">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-7 py-3 border border-slate-300">
                Tên chỉ huy
              </th>
              <th scope="col" className="px-7 py-3 border border-slate-300">
                Chức vụ
              </th>
              <th scope="col" className="px-7 py-3 border border-slate-300">
                Số điện thoại
              </th>
              <th scope="col" className="px-7 py-3 border border-slate-300">
                Địa chỉ email
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                className="px-7 py-4 font-medium whitespace-nowrap dark:text-white border border-slate-300"
              >
                Trần Văn X
              </th>
              <td className="px-7 py-4 border border-slate-300">Hệ trưởng</td>
              <td className="px-7 py-4 border border-slate-300">0123456789</td>
              <td className="px-7 py-4 border border-slate-300">
                tranvanx@gmail.com
              </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                className="px-7 py-4 font-medium whitespace-nowrap dark:text-white border border-slate-300"
              >
                Nguyễn Văn Y
              </th>
              <td className="px-7 py-4 border border-slate-300">
                Chính trị viên
              </td>
              <td className="px-7 py-4 border border-slate-300">0112233445</td>
              <td className="px-7 py-4 border border-slate-300">
                nguyenvany@gmail.com
              </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
              <th
                scope="row"
                className="px-7 py-4 font-medium whitespace-nowrap dark:text-white border border-slate-300"
              >
                Cao Văn Z
              </th>
              <td className="px-7 py-4 border border-slate-300">Hệ phó</td>
              <td className="px-7 py-4 border border-slate-300">0111122222</td>
              <td className="px-7 py-4 border border-slate-300">
                caovanc@gmail.com
              </td>
            </tr>
          </tbody>
        </table>
        <ul className="px-8">
          <li className="text-red-600 text-sm italic">
            *Lưu ý: không nên gọi điện hoặc gặp trực tiếp vào giờ ngủ trưa, ngủ
            tối, không phải giờ làm việc nếu không phải công việc cấp bách, quan
            trọng!
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Contact;
