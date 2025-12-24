import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Drawer, Grid, Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SyncOutlined, DownloadOutlined, UserOutlined, MenuOutlined } from "@ant-design/icons";
import { logout } from "../../store/authSlice";
import ProfileModal from "../models/ProfileModal";
import LogoImg from "../../assets/Logo.png";

const { Header } = Layout;
const { useBreakpoint } = Grid;

const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const screens = useBreakpoint();

  const { user } = useSelector((state) => state.auth);
  const [profileOpen, setProfileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isDashboard = location.pathname === "/dashboard";
  const isPosts = location.pathname === "/posts";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  const profileItems = [
    {
      key: "profile",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "4px 8px",
            fontSize: 14,
            color: "#464E5F",
            fontWeight: 500,
          }}
        >
          <SyncOutlined style={{ fontSize: 16, color: "#7E8299" }} />
          <span>Profile</span>
        </div>
      ),
      onClick: () => setProfileOpen(true),
    },
    {
      key: "logout",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "4px 8px",
            fontSize: 14,
            color: "#464E5F",
            fontWeight: 500,
          }}
        >
          <DownloadOutlined style={{ fontSize: 16, color: "#7E8299" }} />
          <span>Logout</span>
        </div>
      ),
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: "dashboard",
      label: (
        <div
          style={{
            width: screens.lg ? 116 : "100%",
            height: 40,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: screens.lg ? "center" : "flex-start",
            paddingLeft: screens.lg ? 0 : 16,
            backgroundColor: isDashboard ? "rgba(36, 36, 36, 1)" : "transparent",
            color: isDashboard ? "#fff" : "#9b9b9b",
          }}
        >
          Dashboard
        </div>
      ),
      onClick: () => {
        navigate("/dashboard");
        setDrawerOpen(false);
      },
    },
    {
      key: "posts",
      label: (
        <div
          style={{
            width: screens.lg ? 116 : "100%",
            height: 40,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: screens.lg ? "center" : "flex-start",
            paddingLeft: screens.lg ? 0 : 16,
            backgroundColor: isPosts ? "rgba(36, 36, 36, 1)" : "transparent",
            color: isPosts ? "#fff" : "#9b9b9b",
          }}
        >
          Posts
        </div>
      ),
      onClick: () => {
        navigate("/posts");
        setDrawerOpen(false);
      },
    },
  ];

  /* Drawer */
  const drawerNavItems = menuItems.map(item => ({
    ...item,
    label: (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          paddingLeft: 16,
          borderRadius: 6,
          backgroundColor: (item.key === "dashboard" && isDashboard) || (item.key === "posts" && isPosts)
            ? "rgba(255, 255, 255, 0.1)"
            : "transparent",
          color: (item.key === "dashboard" && isDashboard) || (item.key === "posts" && isPosts)
            ? "#fff"
            : "#9b9b9b",
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        {item.key === "dashboard" ? "Dashboard" : "Posts"}
      </div>
    )
  }));

  const drawerFooterItems = [
    {
      key: "profile-mobile",
      label: (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            paddingLeft: 16,
            borderRadius: 6,
            color: "#9b9b9b",
            fontSize: 16,
            fontWeight: 500,
            gap: 12
          }}
        >
          <UserOutlined /> Profile
        </div>
      ),
      onClick: () => {
        setProfileOpen(true);
        setDrawerOpen(false);
      },
    },
    {
      key: "logout-mobile",
      label: (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            paddingLeft: 16,
            borderRadius: 6,
            color: "#F1416C",
            fontSize: 16,
            fontWeight: 500,
            gap: 12
          }}
        >
          <DownloadOutlined /> Logout
        </div>
      ),
      onClick: handleLogout,
    }
  ];

  return (
    <>
      <Header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: 76,
          backgroundColor: "rgba(19, 19, 19, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: screens.lg ? "0 32px 0 100px" : "0 20px",
          zIndex: 1400,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            <img src={LogoImg} alt="logo" height={28} />
          </div>

          {screens.lg ? (
            <Menu
              mode="horizontal"
              selectable={false}
              style={{
                background: "transparent",
                borderBottom: "none",
                display: "flex",
                alignItems: "center"
              }}
              items={menuItems}
            />
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {!screens.lg && (
            <Button
              type="text"
              icon={<MenuOutlined style={{ color: "#fff", fontSize: 20 }} />}
              onClick={() => setDrawerOpen((prev) => !prev)}
            />
          )}

          {screens.lg && (
            <Dropdown
              menu={{ items: profileItems }}
              placement="bottom"
              trigger={["hover"]}
              getPopupContainer={() => document.body}
              arrow={true}
              overlayStyle={{
                width: 172,
                boxShadow: "rgba(169, 194, 209, 0.25) 0 8px 16px 0",
                borderRadius: 8,
                zIndex: 2200,
              }}
            >
              <Avatar
                src={user?.img_url}
                icon={<UserOutlined />}
                shape="square"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  cursor: "pointer",
                  marginRight: screens.lg ? 80 : 0,
                }}
              />
            </Dropdown>
          )}
        </div>
      </Header>

      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar src={user?.img_url} icon={<UserOutlined />} shape="square" size="large" style={{ borderRadius: 8 }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#fff', fontSize: 16, lineHeight: '20px' }}>{user?.firstName || 'User'}</span>
              <span style={{ color: '#7E8299', fontSize: 12, lineHeight: '14px', fontWeight: 400 }}>{user?.email}</span>
            </div>
          </div>
        }
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        styles={{
          body: {
            padding: "10px 0",
            backgroundColor: "rgba(19, 19, 19, 1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%"
          },
          header: {
            backgroundColor: "rgba(19, 19, 19, 1)",
            borderBottom: "1px solid #333",
            padding: "20px 24px"
          }
        }}
        closeIcon={<span style={{ color: "white", fontSize: 18 }}>✕</span>}
      >
        <div style={{ flex: 1 }}>
          <Menu
            mode="inline"
            selectable={false}
            style={{
              background: "transparent",
              borderRight: "none",
            }}
            items={drawerNavItems}
          />
        </div>

        <div style={{ marginBottom: 20, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 10 }}>
          <Menu
            mode="inline"
            selectable={false}
            style={{
              background: "transparent",
              borderRight: "none",
            }}
            items={drawerFooterItems}
          />
        </div>
      </Drawer >

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
};

export default AppHeader;
