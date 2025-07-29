# Hệ thống Theme - Chế độ Sáng/Tối

## Tổng quan

Hệ thống theme đã được tích hợp vào ứng dụng Next.js với Tailwind CSS để hỗ trợ chế độ sáng và tối.

## Các thành phần chính

### 1. Custom Hook: `useTheme`

- **Vị trí**: `src/hooks/useTheme.js`
- **Chức năng**: Quản lý state theme, localStorage, và cập nhật class trên document
- **API**:
  ```javascript
  const {
    theme, // 'light' | 'dark'
    isLoading, // boolean
    toggleTheme, // function
    setLightTheme, // function
    setDarkTheme, // function
    isDark, // boolean
    isLight, // boolean
  } = useTheme();
  ```

### 2. ThemeProvider

- **Vị trí**: `src/components/ThemeProvider.jsx`
- **Chức năng**: Context provider để chia sẻ theme state toàn cục
- **Sử dụng**: Wrap toàn bộ ứng dụng trong layout gốc

### 3. ThemeToggle Component

- **Vị trí**: `src/components/ThemeToggle.jsx`
- **Chức năng**: Button chuyển đổi theme với animation đẹp
- **Props**: `className` (optional)

## Cách sử dụng

### 1. Sử dụng trong component

```javascript
import { useThemeContext } from "@/components/ThemeProvider";

function MyComponent() {
  const { theme, toggleTheme, isDark } = useThemeContext();

  return (
    <div className="bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text">
      <button onClick={toggleTheme}>
        Chuyển sang {isDark ? "sáng" : "tối"}
      </button>
    </div>
  );
}
```

### 2. Sử dụng ThemeToggle

```javascript
import { ThemeToggle } from "@/components/ThemeToggle";

function Header() {
  return (
    <header>
      <ThemeToggle className="ml-4" />
    </header>
  );
}
```

## Tailwind Classes cho Dark Mode

### Background Colors

- `bg-white dark:bg-dark-bg` - Background chính
- `bg-gray-50 dark:bg-dark-surface` - Background phụ
- `bg-gray-100 dark:bg-gray-700` - Background hover

### Text Colors

- `text-gray-900 dark:text-dark-text` - Text chính
- `text-gray-600 dark:text-dark-text-secondary` - Text phụ
- `text-blue-600 dark:text-blue-400` - Text link

### Border Colors

- `border-gray-200 dark:border-dark-border` - Border thường
- `border-gray-300 dark:border-gray-600` - Border hover

### Transition

- `transition-colors duration-200` - Animation mượt mà

## Cấu hình Tailwind

File `tailwind.config.js` đã được cập nhật với:

- `darkMode: 'class'` - Sử dụng class để control dark mode
- Custom colors cho dark mode trong `theme.extend.colors`

## CSS Variables

File `globals.css` chứa CSS variables cho theme:

```css
:root {
  --color-bg: #ffffff;
  --color-surface: #f8f9fa;
  --color-border: #e5e7eb;
  --color-text: #1f2937;
  --color-text-secondary: #6b7280;
}

.dark {
  --color-bg: #1a1a1a;
  --color-surface: #2d2d2d;
  --color-border: #404040;
  --color-text: #e5e5e5;
  --color-text-secondary: #a3a3a3;
}
```

## Tính năng

1. **Lưu trữ**: Theme được lưu trong localStorage
2. **System preference**: Tự động detect system theme preference
3. **Smooth transitions**: Animation mượt mà khi chuyển theme
4. **Responsive**: Hoạt động tốt trên mọi thiết bị
5. **Accessibility**: Hỗ trợ screen reader và keyboard navigation

## Lưu ý

- Sử dụng `suppressHydrationWarning` trong layout gốc để tránh warning hydration
- Theme toggle button được đặt ở góc trên bên phải màn hình
- Tất cả components đã được cập nhật để hỗ trợ dark mode
