import React, { useEffect, useState } from "react";
import { Card, Typography, Input, Avatar, Spin, message, Skeleton, Grid, Button } from "antd";
import Layout from "../Components/layout/Layout";
import axiosInstance from "../utils/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

import Comment from "../Components/layout/Comment";

const { useBreakpoint } = Grid;
const { Title, Paragraph, Text } = Typography;

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const postId = query.get("post");
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loadingComments, setLoadingComments] = useState(false);
  const [backHover, setBackHover] = useState(false);

  useEffect(() => {

    if (isMobile && !postId) {
      setPost(null);
      return;
    }

    const fetchDefaultPost = async () => {

      if (isMobile) return;

      try {
        setLoading(true);
        setComments([]);
        const res = await axiosInstance.get("/posts", { params: { page: 1, size: 1, is_published: true } });
        const first = res?.data?.data?.[0] ?? res?.data?.[0] ?? null;
        if (first) {
          navigate(`/dashboard?post=${first.id}`, { replace: true });

          setPost(first);
          fetchComments(first.id, first);
        } else {
          setPost(null);
          setComments([]);
        }
      } catch (e) {
        message.error("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    const ensurePost = async () => {
      if (postId) {
        try {
          setLoading(true);
          setComments([]);
          const res = await axiosInstance.get(`/posts/${postId}`, { params: { t: Date.now() } });
          const data = res?.data?.data ?? res?.data ?? null;

          if (data && data.is_published) {
            setPost(data);
            fetchComments(data.id, data);
          } else {
            if (!isMobile) fetchDefaultPost();
            else { navigate('/dashboard'); setPost(null); }
          }
        } catch (err) {
          if (!isMobile) fetchDefaultPost();
          else { navigate('/dashboard'); setPost(null); }
        } finally {
          setLoading(false);
        }
      } else {
        fetchDefaultPost();
      }
    };

    ensurePost();
  }, [postId, isMobile]);


  const fetchComments = async (id, postData = null, pageNum = 1) => {
    if (pageNum === 1) {
      setHasMore(true);
    }
    setLoadingComments(true);

    try {
      const res = await axiosInstance.get(`/posts/${id}/comments`, {
        params: { page: pageNum, size: 5, t: Date.now(), sort: 'desc' }
      });
      const data = res?.data?.data ?? res?.data ?? [];
      const meta = res?.data?.meta;

      const newComments = Array.isArray(data) ? data : [];

      if (pageNum === 1) {
        setComments(newComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
      } else {
        setComments(prev => {
          const combined = [...prev, ...newComments];
          return combined.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        });
      }

      if (meta) {
        setHasMore(pageNum < meta.totalPages);
      } else {
        if (newComments.length < 5) setHasMore(false);
        else setHasMore(true);
      }
      setPage(pageNum);

    } catch (error) {
      console.error("Failed to fetch comments API", error);
      if (pageNum === 1) {
        const source = postData || post;
        if (source && Array.isArray(source.comments)) {
          console.log("Falling back to post.comments");
          setComments(source.comments);
        } else {
          setComments([]);
        }
        setHasMore(false);
      }
    } finally {
      setLoadingComments(false);
    }
  };

  const fetchPost = async (id, background = false) => {
    try {
      if (!background) {
        setLoading(true);
        setComments([]);
      }
      const res = await axiosInstance.get(`/posts/${id}`, { params: { t: Date.now() } });
      const data = res?.data?.data ?? res?.data ?? null;
      console.log("Fetched post data:", data);
      setPost(data);
      if (data) fetchComments(data.id, data, 1);
    } catch (err) {
      if (!background) message.error(err?.response?.data?.message || "Failed to load post");
    } finally {
      if (!background) setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDefaultPost = async () => {
      if (isMobile) return;

      try {
        setLoading(true);
        setComments([]);
        const res = await axiosInstance.get("/posts", { params: { page: 1, size: 1, is_published: true } });
        const first = res?.data?.data?.[0] ?? res?.data?.[0] ?? null;
        if (first) {
          navigate(`/dashboard?post=${first.id}`, { replace: true });
          setPost(first);
          fetchComments(first.id, first);
        } else {
          setPost(null);
          setComments([]);
        }
      } catch (e) {
        message.error("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    const ensurePost = async () => {
      if (postId) {
        try {
          if (!loading) setLoading(true);
          setComments([]);
          const res = await axiosInstance.get(`/posts/${postId}`, { params: { t: Date.now() } });
          const data = res?.data?.data ?? res?.data ?? null;

          if (data && data.is_published) {
            setPost(data);
            fetchComments(data.id, data);
          } else {
            if (!isMobile) fetchDefaultPost();
            else { navigate('/dashboard'); setPost(null); }
          }
        } catch (err) {
          if (!isMobile) fetchDefaultPost();
          else { navigate('/dashboard'); setPost(null); }
        } finally {
          setLoading(false);
        }
      } else {
        if (!isMobile) fetchDefaultPost();
        else setPost(null);
      }
    };

    ensurePost();
  }, [postId, isMobile]);

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

  const showSidebar = !isMobile || (isMobile && !postId);
  const showContent = !isMobile || (isMobile && postId);

  return (
    <Layout showSidebar={showSidebar} showContent={showContent}>
      {isMobile && postId && (
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            setPost(null);
            navigate('/dashboard');
          }}
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
          style={{
            marginBottom: 16,
            borderColor: backHover ? '#3E97FF' : '#d9d9d9',
            color: backHover ? '#3E97FF' : 'rgba(0, 0, 0, 0.88)',
            transition: 'all 0.3s'
          }}
        >
          Back to List
        </Button>
      )}
      <Card
        style={{
          width: "100%",
          height: "auto",
          minHeight: isMobile ? "auto" : 856,
          borderRadius: 12,
          boxShadow: "rgba(0, 0, 0, 0.03) 0 3px 4px 0",
          margin: 0,
          display: "flex",
          flexDirection: "column",
        }}
        styles={{
          body: {
            padding: isMobile ? "20px 16px" : "30px 28px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }
        }}
      >
        {loading || !post ? (
          <div style={{ padding: 0 }}>
            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              <Skeleton.Avatar active size={48} shape="square" />
              <div style={{ flex: 1 }}>
                <Skeleton active title={false} paragraph={{ rows: 2, width: ["30%", "20%"] }} />
              </div>
            </div>
            <Skeleton.Button active block style={{ width: "100%", height: 420, marginBottom: 20, borderRadius: 12 }} />
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        ) : (
          <>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <Avatar
                  size={48}
                  src={post?.author?.img_url}
                  shape="square"
                  style={{ borderRadius: 9 }}
                />
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
                  <Text
                    style={{
                      color: "rgba(63, 66, 84, 1)",
                      fontSize: 18,
                      fontWeight: 400,
                      letterSpacing: "-0.18px",
                      lineHeight: "18px",
                    }}
                  >
                    {`${post?.author?.first_name ?? ""} ${post?.author?.last_name ?? ""}`}
                  </Text>
                  <Text
                    style={{
                      color: "rgba(161, 165, 183, 1)",
                      fontSize: 13,
                      fontWeight: 400,
                      lineHeight: "14px",
                    }}
                  >
                    {formatDateShort(post.createdAt)}
                  </Text>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <img
                  src={post.img_url}
                  alt="post"
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    maxHeight: 420,
                    objectFit: "cover",
                  }}
                />
              </div>

              <Title level={4}>{post.title}</Title>


              <Paragraph
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  color: "rgba(94, 98, 120, 1)",
                  fontSize: 16,
                  fontWeight: 400,
                  whiteSpace: "pre-wrap",
                }}
              >
                {post.content}
              </Paragraph>
            </div>

            <Comment
              postId={post.id}
              comments={comments}
              onCommentAdded={() => fetchPost(post.id, true)}
              hasMore={hasMore}
              loadingComments={loadingComments}
              onLoadMore={() => fetchComments(post.id, post, page + 1)}
            />
          </>
        )}
      </Card>
    </Layout>
  );
};

export default Dashboard;
