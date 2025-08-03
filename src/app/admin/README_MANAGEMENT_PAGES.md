# Hướng dẫn sử dụng các trang quản lý phân cấp

## Tổng quan

Hệ thống quản lý đã được cải tiến với cấu trúc điều hướng phân cấp rõ ràng, tuân theo thứ tự: **Trường Đại Học → Khoa/Viện → Chương trình đào tạo → Lớp**. Mỗi cấp chỉ có thể truy cập từ cấp cha trực tiếp của nó.

## Cấu trúc điều hướng phân cấp

### 1. Quản lý Trường Đại Học

- **URL**: `/admin/universities`
- **Chức năng**: Hiển thị danh sách tất cả trường đại học
- **Điều hướng**: Chỉ có thể chuyển đến quản lý khoa/viện của trường đó

### 2. Quản lý Khoa/Viện

- **URL**: `/admin/universities/[universityId]/organizations`
- **Chức năng**: Hiển thị danh sách khoa/viện thuộc một trường cụ thể
- **Điều hướng**: Có thể chuyển đến quản lý chương trình đào tạo của khoa/viện đó

### 3. Quản lý Chương trình đào tạo

- **URL**: `/admin/universities/[universityId]/organizations/[organizationId]/education-levels`
- **Chức năng**: Hiển thị danh sách chương trình đào tạo thuộc một khoa/viện cụ thể
- **Điều hướng**: Có thể chuyển đến quản lý lớp của chương trình đào tạo đó

### 4. Quản lý Lớp

- **URL**: `/admin/universities/[universityId]/organizations/[organizationId]/education-levels/[educationLevelId]/classes`
- **Chức năng**: Hiển thị danh sách lớp thuộc một chương trình đào tạo cụ thể
- **Điều hướng**: Đây là cấp cuối cùng trong hệ thống

## Cách sử dụng từng bước

### Bước 1: Truy cập quản lý trường đại học

1. Đăng nhập vào hệ thống admin
2. Truy cập `/admin/universities`
3. Xem danh sách tất cả trường đại học
4. Để quản lý khoa/viện của một trường, nhấp vào biểu tượng 📚 (BookOutlined) trong cột "Thao tác"

### Bước 2: Quản lý khoa/viện

1. Từ trang quản lý trường đại học, nhấp vào biểu tượng khoa/viện
2. Hệ thống sẽ chuyển đến trang quản lý khoa/viện của trường đó
3. Thêm, chỉnh sửa, xóa khoa/viện
4. Để quản lý chương trình đào tạo, nhấp vào biểu tượng 🏆 (TrophyOutlined)

### Bước 3: Quản lý chương trình đào tạo

1. Từ trang quản lý khoa/viện, nhấp vào biểu tượng chương trình đào tạo
2. Hệ thống sẽ chuyển đến trang quản lý chương trình đào tạo của khoa/viện đó
3. Thêm, chỉnh sửa, xóa chương trình đào tạo
4. Để quản lý lớp, nhấp vào biểu tượng 👥 (TeamOutlined)

### Bước 4: Quản lý lớp

1. Từ trang quản lý chương trình đào tạo, nhấp vào biểu tượng lớp
2. Hệ thống sẽ chuyển đến trang quản lý lớp của chương trình đào tạo đó
3. Thêm, chỉnh sửa, xóa lớp

## Tính năng chung

### 1. Breadcrumb Navigation

- Mỗi trang đều có breadcrumb để hiển thị đường dẫn hiện tại
- Có thể nhấp vào các mục trong breadcrumb để quay lại trang trước đó

### 2. Tìm kiếm

- Mỗi trang đều có thanh tìm kiếm
- Tìm kiếm theo tên của đối tượng đang quản lý

### 3. Thêm mới

- Nút "Thêm" ở góc trên bên phải
- Form modal để nhập thông tin
- Validation đầy đủ

### 4. Chỉnh sửa

- Biểu tượng chỉnh sửa (EditOutlined) trong cột "Thao tác"
- Form modal với thông tin đã được điền sẵn

### 5. Xóa

- Biểu tượng xóa (DeleteOutlined) trong cột "Thao tác"
- Xác nhận trước khi xóa

## Cải tiến giao diện

### 1. Bảng có đường viền rõ ràng

- Tất cả bảng đều có border để tạo cảm giác grid-like
- Dễ nhìn và phân biệt các ô

### 2. Hiển thị phân cấp trong bảng trường đại học

- Khi một trường có nhiều khoa/viện, thông tin được hiển thị theo từng dòng
- Có đường phân cách giữa các khoa/viện
- Tương tự cho chương trình đào tạo và lớp

### 3. Breadcrumb và điều hướng

- Mỗi trang hiển thị thông tin về cấp cha
- Nút "Quay lại" để dễ dàng điều hướng

## Cấu trúc dữ liệu

### University (Trường Đại Học)

```javascript
{
  _id: "university_id",
  universityCode: "UNI001",
  universityName: "Đại học ABC"
}
```

### Organization (Khoa/Viện)

```javascript
{
  _id: "organization_id",
  organizationName: "Khoa Công nghệ thông tin",
  travelTime: 45,
  universityId: "university_id"
}
```

### Education Level (Chương trình đào tạo)

```javascript
{
  _id: "education_level_id",
  levelName: "Cử nhân",
  organizationId: "organization_id"
}
```

### Class (Lớp)

```javascript
{
  _id: "class_id",
  className: "CNTT-K62",
  studentCount: 30,
  educationLevelId: "education_level_id"
}
```

## API Endpoints

### Universities

- `GET /university` - Lấy danh sách trường đại học
- `POST /university/create` - Tạo trường đại học mới
- `PUT /university/:id` - Cập nhật trường đại học
- `DELETE /university/:id` - Xóa trường đại học

### Organizations

- `GET /university/:universityId/organizations` - Lấy danh sách khoa/viện của trường
- `POST /university/:universityId/organizations` - Tạo khoa/viện mới
- `PUT /university/organizations/:id` - Cập nhật khoa/viện
- `DELETE /university/organizations/:id` - Xóa khoa/viện

### Education Levels

- `GET /university/organizations/:organizationId/education-levels` - Lấy danh sách chương trình đào tạo
- `POST /university/organizations/:organizationId/education-levels` - Tạo chương trình đào tạo mới
- `PUT /university/education-levels/:id` - Cập nhật chương trình đào tạo
- `DELETE /university/education-levels/:id` - Xóa chương trình đào tạo

### Classes

- `GET /university/education-levels/:educationLevelId/classes` - Lấy danh sách lớp
- `POST /university/education-levels/:educationLevelId/classes` - Tạo lớp mới
- `PUT /university/classes/:id` - Cập nhật lớp
- `DELETE /university/classes/:id` - Xóa lớp

## Lưu ý quan trọng

1. **Điều hướng phân cấp bắt buộc**: Không thể truy cập trực tiếp vào các trang con mà không thông qua cấp cha
2. **Dữ liệu phân cấp**: Mỗi cấp chỉ hiển thị dữ liệu thuộc về cấp cha của nó
3. **Breadcrumb**: Luôn hiển thị đường dẫn đầy đủ để người dùng biết vị trí hiện tại
4. **Validation**: Tất cả form đều có validation để đảm bảo dữ liệu hợp lệ
5. **Responsive**: Giao diện được thiết kế responsive cho các thiết bị khác nhau

## Lợi ích của cấu trúc mới

1. **Tổ chức rõ ràng**: Dữ liệu được tổ chức theo cấu trúc phân cấp logic
2. **Dễ quản lý**: Mỗi cấp chỉ quản lý dữ liệu thuộc về nó
3. **Trải nghiệm người dùng tốt**: Điều hướng trực quan và dễ hiểu
4. **Bảo mật**: Người dùng chỉ có thể truy cập dữ liệu theo quyền phân cấp
5. **Hiệu suất**: Tải dữ liệu theo từng cấp, không tải toàn bộ dữ liệu cùng lúc
