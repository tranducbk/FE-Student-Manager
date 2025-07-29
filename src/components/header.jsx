"use client";

import { jwtDecode } from "jwt-decode";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuOutlined,
  CloseOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Avatar,
  Dropdown,
  Badge,
  Button,
  Menu,
  Typography,
  Space,
  Divider,
  Card,
  Tag,
  theme,
  Drawer,
} from "antd";
import TabNotification from "./tabNotification";
import { ThemeToggle } from "./ThemeToggle";
import { useThemeContext } from "./ThemeProvider";
import { BASE_URL } from "@/configs";

const { Header: AntHeader } = Layout;
const { Text, Title } = Typography;

const Header = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const frameRef = useRef(null);
  const { token: themeToken } = theme.useToken();
  const { theme: currentTheme } = useThemeContext();

  useEffect(() => {
    fetchDocuments();

    const interval = setInterval(fetchDocuments, 50000);

    return () => clearInterval(interval);
  }, []);

  const fetchDocuments = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${BASE_URL}/commander/studentNotifications/${jwtDecode(token).id}`,
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );

      setDocuments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (frameRef.current && !frameRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchData();
    fetchUserDetail();
  }, []);

  const fetchUserDetail = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.admin === true) {
          const res = await axios.get(
            `${BASE_URL}/commander/${decodedToken.id}`,
            {
              headers: {
                token: `Bearer ${token}`,
              },
            }
          );

          setUserDetail(res.data);
        } else {
          const res = await axios.get(
            `${BASE_URL}/student/${decodedToken.id}`,
            {
              headers: {
                token: `Bearer ${token}`,
              },
            }
          );

          setUserDetail(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        const res = await axios.get(`${BASE_URL}/user/${decodedToken.id}`, {
          headers: {
            token: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.post(`${BASE_URL}/user/logout`, null, {
          headers: {
            token: `Bearer ${token}`,
          },
        });

        localStorage.removeItem("token");
        router.push("/login");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleDropdownClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOutsideClick = () => {
    setDropdownOpen(false);
  };

  const handleUpdateIsRead = async (e, notificationId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        await axios.put(
          `${BASE_URL}/commander/notification/${decodedToken.id}/${notificationId}`,
          { isRead: true },
          {
            headers: {
              token: `Bearer ${token}`,
            },
          }
        );
        setDocuments((prevDocs) =>
          prevDocs.map((doc) =>
            doc._id === notificationId ? { ...doc, isRead: true } : doc
          )
        );
        setDropdownOpen(false);
        router.push(`/users/notification/${notificationId}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const unreadCount = Array.isArray(documents)
    ? documents.filter((doc) => !doc.isRead).length
    : 0;

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: (
        <Link
          href={
            user?.isAdmin === true
              ? `/admin/${user?._id}`
              : `/users/${user?._id}`
          }
        >
          <Space direction="vertical" size={0}>
            <Text strong>{userDetail?.fullName || "Thông tin cá nhân"}</Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {userDetail?.email}
            </Text>
          </Space>
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <Link href="/change-password">Đổi mật khẩu</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  const notificationItems = documents?.map((doc) => ({
    key: doc._id,
    label: (
      <Card
        size="small"
        style={{
          margin: "4px 0",
          backgroundColor: doc.isRead
            ? "transparent"
            : themeToken.colorPrimaryBg,
          border: `1px solid ${themeToken.colorBorder}`,
        }}
        onClick={(e) => handleUpdateIsRead(e, doc._id)}
      >
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
          <Space>
            <Text strong>[{doc.author}]</Text>
            {!doc.isRead && (
              <Tag color="blue" size="small">
                Mới
              </Tag>
            )}
          </Space>
          <Text>{doc.title}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {dayjs(doc.dateIssued).format("DD/MM/YYYY")}
          </Text>
        </Space>
      </Card>
    ),
  }));

  const mobileMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: (
        <Link
          href={
            user?.isAdmin === true
              ? `/admin/${user?._id}`
              : `/users/${user?._id}`
          }
          onClick={() => setMobileMenuOpen(false)}
        >
          <Space direction="vertical" size={0}>
            <Text strong>{userDetail?.fullName || "Thông tin cá nhân"}</Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {userDetail?.email}
            </Text>
          </Space>
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: (
        <Link href="/change-password" onClick={() => setMobileMenuOpen(false)}>
          Đổi mật khẩu
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: () => {
        handleLogout();
        setMobileMenuOpen(false);
      },
    },
  ];

  // Reusable button components
  const NotificationButton = ({ className = "" }) => (
    <Button
      type="text"
      icon={<BellOutlined />}
      size="large"
      className={`theme-button-primary ${className}`}
    />
  );

  const UserMenuButton = () => (
    <Button
      type="text"
      onClick={() => toggleDropdown()}
      className="theme-button-secondary"
    >
      <Avatar
        src={userDetail?.avatar}
        size="small"
        icon={<UserOutlined />}
        style={{ marginRight: 8 }}
      />
      <div className="flex flex-col items-start mr-2">
        <Text strong className="text-sm leading-tight theme-text-primary">
          {user?.username}
        </Text>
        <Text
          type="secondary"
          className="text-xs leading-tight theme-text-secondary"
        >
          {user?.isAdmin ? "Quản trị viên" : "Học viên"}
        </Text>
      </div>
      <DownOutlined className="text-xs theme-icon" />
    </Button>
  );

  const MobileMenuButton = () => (
    <Button
      type="text"
      icon={mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className="theme-button-primary"
    />
  );

  return (
    <>
      <AntHeader className="theme-header">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link
            href={`/${user?.isAdmin ? "admin" : "users"}`}
            className="flex items-center"
          >
            <img src="/logo.png" className="h-8 md:h-10 mr-3" alt="H5 Logo" />
            <Title level={4} className="theme-title">
              HỆ HỌC VIÊN 5
            </Title>
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications - Only for non-admin users */}
          {!user?.isAdmin && (
            <Dropdown
              menu={{
                items: notificationItems,
                style: {
                  maxHeight: "400px",
                  overflowY: "auto",
                  width: "320px",
                },
              }}
              open={dropdownOpen}
              onOpenChange={setDropdownOpen}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Badge count={unreadCount} size="small">
                <NotificationButton />
              </Badge>
            </Dropdown>
          )}

          {/* User Menu */}
          <Dropdown
            menu={{ items: userMenuItems }}
            open={isOpen}
            onOpenChange={setIsOpen}
            placement="bottomRight"
            trigger={["click"]}
          >
            <UserMenuButton />
          </Dropdown>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center space-x-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications - Only for non-admin users */}
          {!user?.isAdmin && (
            <Dropdown
              menu={{
                items: notificationItems,
                style: {
                  maxHeight: "300px",
                  overflowY: "auto",
                  width: "280px",
                },
              }}
              open={dropdownOpen}
              onOpenChange={setDropdownOpen}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Badge count={unreadCount} size="small">
                <NotificationButton />
              </Badge>
            </Dropdown>
          )}

          {/* Mobile Menu Button */}
          <MobileMenuButton />
        </div>
      </AntHeader>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div className="flex items-center">
            <Avatar
              src={userDetail?.avatar}
              size="large"
              icon={<UserOutlined />}
              style={{ marginRight: 12 }}
            />
            <div>
              <Text strong style={{ color: themeToken.colorText }}>
                {userDetail?.fullName || "Thông tin cá nhân"}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {userDetail?.email}
              </Text>
            </div>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
        bodyStyle={{ padding: 0 }}
        headerStyle={{
          background: themeToken.colorBgContainer,
          borderBottom: `1px solid ${themeToken.colorBorder}`,
        }}
      >
        <Menu
          mode="inline"
          items={mobileMenuItems}
          style={{
            border: "none",
            background: "transparent",
          }}
        />
      </Drawer>
    </>
  );
};

export default Header;
