import SideBar from "@/components/sidebar";
import Link from "next/link";

const RegulatoryRegime = () => {
  return (
    <div className="flex">
      <div>
        <SideBar />
      </div>
      <div className="w-full ml-64">
        <div className="w-full pt-20 pl-5">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <Link
                  href="/users"
                  className="inline-flex items-center text-sm font-medium hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3 me-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Trang chủ
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="rtl:rotate-180 w-3 h-3 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <div className="ms-1 text-sm pointer-events-none text-custom text-opacity-70 font-medium md:ms-2 dark:text-gray-400 dark:hover:text-white">
                    Chế độ quy định
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full pt-8 pb-5 pl-5 pr-6 mb-5">
          <div className="bg-white rounded-lg w-full">
            <div className="font-bold pt-5 pl-5 pb-5">CHẾ ĐỘ QUY ĐỊNH</div>
            <div className="w-full pl-5 pb-5 pr-5">
              <div className="text-sm font-bold text-blue-600">
                Thời gian sinh hoạt, làm việc
              </div>
              <div class="flex flex-col">
                <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div class="overflow-hidden">
                      <table class="min-w-full border border-neutral-200 text-center text-sm font-light text-surface dark:border-white/10 dark:text-white">
                        <thead class="border-b bg-sky-100 border-neutral-200 font-medium dark:border-white/10">
                          <tr>
                            <th
                              scope="col"
                              class="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                            >
                              Thời gian
                            </th>
                            <th
                              scope="col"
                              class="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                            >
                              Nội dung
                            </th>
                          </tr>
                        </thead>
                        <tbody className="font-medium">
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              5h00
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Báo thức
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              5h00
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Thể dục sáng từ 10 đến 20 phút, gấp xếp nội vụ,
                              dọn vệ sinh
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              5h30
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Ăn sáng
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              6h00
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Kiểm tra sáng
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              6h15
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Chuẩn bị vật chất, vũ khí trang bị học tập, huấn
                              luyện và đi đến nơi học tập huấn luyện, lúc đi
                              thường đi đều và vừa đi vừa hát
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              6h30 - 11h
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Thời gian học tập huấn luyện buổi sáng
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              11h05
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Ăn trưa
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              11h30
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Nghỉ trưa
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              13h45
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Báo thức chiều
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              13h45
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Chuẩn bị đi học tập, huấn luyện chiều
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              14h-17h
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Học tập huấn luyện buổi chiều
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              17h00
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Bảo quản vũ khí trang bị
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              17h30
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Thể thao, tăng gia sản xuất, vệ sinh cá nhân
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              18h
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Ăn chiều
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              18h30
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Sinh hoạt tổ 3 người
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              18h45
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Đọc báo, nghe tin
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              19h00
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Xem Thời sự Đài THVN
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              20h00
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Sinh hoạt theo quy định
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              20h45
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Điểm danh, điểm quân số
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              21h00
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Nghe chương trình QĐND của Đài TNVN
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              21h30
                            </td>
                            <td class=" border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Tắt đèn, ngủ nghỉ
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 max-w-full text-sm font-bold text-blue-600">
                10 lời thề danh dự
              </div>
              <div class="flex flex-col">
                <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div class="overflow-hidden">
                      <table class="min-w-full border border-neutral-200 text-center text-sm font-light text-surface dark:border-white/10 dark:text-white">
                        <thead class="border-b bg-sky-100 border-neutral-200 font-medium dark:border-white/10">
                          <tr>
                            <th
                              scope="col"
                              class="border-e  border-neutral-200 px-6 py-4 dark:border-white/10"
                            >
                              Lời thề
                            </th>
                            <th
                              scope="col"
                              class="border-e border-neutral-200 px-6 py-4 dark:border-white/10"
                            >
                              Nội dung
                            </th>
                          </tr>
                        </thead>
                        <tbody className="font-medium">
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class="border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              1
                            </td>

                            <td class="border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Hy sinh tất cả vì tổ quốc Việt Nam; dưới sự lãnh
                              đạo của Đảng Cộng sản Việt Nam, phấn đấu thực hiện
                              một nước Việt Nam hòa bình, độc lập và xã hội chủ
                              nghĩa, góp phần tích cực vào cuộc đấu tranh của
                              nhân dân thế giới vì hòa bình, độc lập dân tộc,
                              dân chủ và chủ nghĩa xã hội. “Xin Thề”
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class="border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              2
                            </td>

                            <td class="border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Tuyệt đối phục tùng mệnh lệnh cấp trên; khi nhận
                              bất cứ nhiệm vụ gì đều tận tâm, tận lực thi hành
                              nhanh chóng và chính xác. “Xin thề”
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class="border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              3
                            </td>

                            <td class="border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Không ngừng nâng cao tinh thần yêu nước Xã hội chủ
                              nghĩa, tinh thần quốc tế vô sản, rèn luyện ý chí
                              chiến đấu kiên quyết và bền bỉ, thắng không kiêu,
                              bại không nản, dù gian lao khổ hạnh cũng không sờn
                              lòng, vào sống ra chết cũng không nản chí ” Nhiệm
                              vụ nào cũng hoàn thành, khó khăn nào cũng vượt
                              qua, kẻ thù nào cũng đánh thắng”. “Xin thề”
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class="border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              4
                            </td>

                            <td class="border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Ra sức học tập nâng cao trình độ chính trị, quân
                              sự, văn hóa, khoa học kỹ thuật, nghiệp vụ, triệt
                              để chấp hành điều lệnh, điều lệ, rèn luyện tính tổ
                              chức, tính kỷ luật và tác phong chính quy, xây
                              dựng quân đội ngày càng hùng mạnh, luôn luôn sẵn
                              sàng chiến đấu. “Xin thề”
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class="border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              5
                            </td>

                            <td class="border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Nêu cao tinh thần làm chủ tập thể xã hội chủ
                              nghĩa, làm tròn nhiệm vụ chiến đấu bảo vệ tổ quốc,
                              xây dựng chủ nghĩa xã hội và làm tròn nghĩa vụ
                              quốc tế. Gương mẫu chấp hành và vận động nhân dân
                              thực hiện mọi đường lối, chủ trương của Đảng,
                              chính sách và luật pháp của Nhà nước. “Xin thề”
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class="border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              6
                            </td>

                            <td class="border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Luôn luôn cảnh giác, tuyệt đối giữ bí mật quân sự
                              và bí mật quốc gia. Nếu bị quân địch bắt, dù phải
                              chịu cực hình tàn khốc thế nào cũng cương quyết
                              một lòng trung thành với sự nghiệp cách mạng,
                              không bao giờ phản bội xưng khai. “Xin thề”
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class="border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              7
                            </td>

                            <td class="border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Đoàn kết chặt chẽ với nhau như ruột thịt trên tình
                              thương yêu giai cấp; hết lòng giúp đỡ nhau lúc
                              thường cũng như lúc ra trận; thực hiện toàn quân
                              một ý chí. “Xin thề”
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class="border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              8
                            </td>

                            <td class="border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Ra sức giữ gìn vũ khí trang bị, quyết không để hư
                              hỏng hoặc rơi vào tay quân thù. Luôn nêu cao tinh
                              thần bảo vệ của công, không tham ô, lãng phí. “Xin
                              thề”
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class="border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              9
                            </td>

                            <td class="border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Khi tiếp xúc với nhân dân làm đúng ba điều nên:
                              Kính trọng dân + Giúp đỡ dân + Bảo vệ dân và ba
                              điều răn: + Không lấy của dân + Không dọa nạt dân
                              + Không quấy nhiễu dân Để gây lòng tin cậy, yêu
                              mến của nhân dân, thực hiện quân với dân một ý
                              chí. “Xin thề”
                            </td>
                          </tr>
                          <tr class="border-b border-neutral-200 dark:border-white/10">
                            <td class="border-e border-neutral-200 px-6 py-4 font-medium dark:border-white/10">
                              10
                            </td>

                            <td class="border-e border-neutral-200 px-6 py-4 dark:border-white/10">
                              Giữ vững phẩm chất tốt đẹp và truyền thống quyết
                              chiến, quyết thắng của quân đội nhân dân, luôn tự
                              phê bình và phê bình, không làm điều gì hại tới
                              danh dự của quân đội và quốc thể nước Cộng hòa Xã
                              hội Chủ nghĩa Việt Nam. “Xin thề”
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatoryRegime;
