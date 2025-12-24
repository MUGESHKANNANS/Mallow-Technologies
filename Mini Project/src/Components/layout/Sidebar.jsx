import React, { useEffect, useState } from "react";
import { List, Typography, message, Skeleton, Tooltip, Grid } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Search from "./Search";
import "./Sidebar.css";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const Sidebar = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const selectedId = query.get("post") ? Number(query.get("post")) : null;

  const formatDateShort = (iso) => {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "";
      const day = d.getDate().toString().padStart(2, "0");
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const mon = months[d.getMonth()];
      const year = d.getFullYear();
      return `${day} ${mon} ${year}`;
    } catch (e) {
      return "";
    }
  };

  const fetchPosts = async (p = 1, q = "", reset = false) => {
    try {
      setLoading(true);
      if (reset && p !== 1) {
      }

      const res = await axiosInstance.get("/posts", {
        params: { page: p, size: 10, search: q, is_published: true },
      });

      const data = res?.data?.data ?? res?.data ?? [];
      const meta = res?.data?.meta ?? {};

      const newPosts = data.map((item) => ({
        id: item.id,
        title: item.title,
        author: `${item?.author?.first_name ?? ""} ${item?.author?.last_name ?? ""}`.trim(),
        date: formatDateShort(item.createdAt),
        image: item.img_url,
        is_published: item.is_published,
      })); 

      const filteredPosts = newPosts.filter(post => post.is_published);

      if (reset) {
        setPosts(filteredPosts);
      } else {
        setPosts((prev) => [...prev, ...filteredPosts]);
      }

      if (data.length < 10) {
        setHasMore(false);
      } else if (meta.total && (posts.length + filteredPosts.length) >= meta.total) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

    } catch (err) {
      message.error(err?.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      fetchPosts(1, searchText, true);
    }, 350);

    return () => clearTimeout(t);
  }, [searchText]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollHeight - scrollTop <= clientHeight + 10) {
      if (!loading && hasMore) {
        setPage((prev) => {
          const nextPage = prev + 1;
          fetchPosts(nextPage, searchText, false);
          return nextPage;
        });
      }
    }
  };

  return (
    <div className="sidebar"
      style={{
        width: "100%",
        height: "100%",
        background: "#fff",
        paddingTop: isMobile ? 20 : 30,
        paddingLeft: isMobile ? 12 : 30,
        paddingRight: isMobile ? 12 : 30,
        paddingBottom: 24,
        borderRadius: 8,
        boxShadow: "rgba(0, 0, 0, 0.03) 0 3px 4px 0",
        display: "flex",
        flexDirection: "column",
        overflowY: "hidden",
        overflowX: "hidden",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", justifyContent: "space-between", gap: isMobile ? 12 : 24, marginBottom: 24 }}>
        <Title level={5} style={{ margin: 0 }}>
          Published blogs
        </Title>
        <Search
          placeholder="Search"
          onSearch={(value) => setSearchText(value)}
          style={{ borderRadius: 8, width: isMobile ? "100%" : 200, marginBottom: 0 }}
          size="middle"
        />
      </div>

      <div
        className="sidebar-list"
        style={{ flex: 1, overflowY: "auto", paddingRight: 8 }}
        onScroll={handleScroll}
      >
        {loading && posts.length === 0 ? (
          <div style={{ padding: 10 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: 30 }}>
                <Skeleton.Image active style={{ width: 120, height: 80 }} />
                <div style={{ flex: 1 }}>
                  <Skeleton active title={false} paragraph={{ rows: 2, width: ["100%", "60%"] }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <List
              itemLayout="horizontal"
              dataSource={posts}
              loading={false}
              split={false}
              style={{ padding: 0 }}
              renderItem={(item) => (
                <List.Item
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    cursor: "pointer",
                    background:
                      selectedId === item.id
                        ? "rgba(62,151,255,0.1)"
                        : hoveredId === item.id
                          ? "rgba(0, 0, 0, 0.08)"
                          : "transparent",
                    borderRadius: 6,
                    padding: 12,
                    alignItems: "center",
                    transition: "background 0.2s",
                    marginBottom: 30,
                  }}
                  onClick={() => navigate(`/dashboard?post=${item.id}`)}
                >
                  <div style={{ display: "flex", gap: 16, alignItems: "center", width: "100%" }}>
                    <div style={{ flex: `0 0 ${isMobile ? 80 : 120}px` }}>
                      <img
                        src={item.image || "https://picsum.photos/536/354"}
                        alt={item.title}
                        style={{
                          width: isMobile ? 80 : 120,
                          height: 80,
                          borderRadius: 6,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: 80, justifyContent: "center" }}>
                        <Text
                          style={{
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "100%",
                            color: "rgba(24, 28, 50, 1)",
                            fontSize: 16,
                            fontWeight: 400,
                            lineHeight: "16px",
                          }}
                        >
                          {item.title}
                        </Text>
                        <div style={{ marginTop: 8, display: "flex", width: "100%", overflow: "hidden" }}>
                          <Tooltip title={item.author} placement="top">
                            <Text
                              style={{
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                color: "rgba(126, 130, 153, 1)",
                                fontSize: 14,
                                fontWeight: 400,
                                lineHeight: "14px",
                                marginRight: 4,
                              }}
                            >
                              {item.author},
                            </Text>
                          </Tooltip>
                          <Text
                            style={{
                              whiteSpace: "nowrap",
                              color: "rgba(126, 130, 153, 1)",
                              fontSize: 14,
                              fontWeight: 400,
                              lineHeight: "14px",
                              flexShrink: 0,
                            }}
                          >
                            {item.date}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
            {loading && (
              <div style={{ padding: 12, textAlign: "center", color: "#999" }}>
                Loading more...
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination removed for Infinite Scroll */}
    </div>
  );
};

export default Sidebar;
