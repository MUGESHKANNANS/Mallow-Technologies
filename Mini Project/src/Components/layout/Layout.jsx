import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Grid } from "antd";

const { useBreakpoint } = Grid;

const Layout = ({ children, showSidebar = true, showContent = true }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", paddingTop: 76, overflow: "hidden" }}>
      <Header />

      <div style={{ display: "flex", height: "calc(100vh - 76px)" }}>
        {/* Sidebar */}
        <div
          style={{
            display: (isMobile && !showSidebar) ? "none" : "block",
            width: isMobile ? "100%" : 413,
            flexShrink: 0,
            marginLeft: isMobile ? 0 : 100,
            marginTop: isMobile ? 0 : 50,
            height: "calc(100% - 49px)",
            padding: isMobile ? "10px 20px" : 0
          }}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            display: (isMobile && !showContent) ? "none" : "block",
            marginLeft: isMobile ? 0 : 30,
            paddingTop: 50,
            paddingRight: isMobile ? 20 : 100,
            paddingBottom: 49,
            paddingLeft: isMobile ? 20 : 24,
            background: "#f5f7fa",
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
