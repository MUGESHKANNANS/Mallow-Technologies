import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Table, Tag, message, Popconfirm, Tooltip, Skeleton, Grid } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import Header from "../Components/layout/Header";
import PostModal from "../Components/models/PostModal";
import axiosInstance from "../utils/axiosInstance";
import Search from "../Components/layout/Search";

const PostLink = ({ text, recordId, isMobile, isRowHovered }) => {
    const [hover, setHover] = useState(false);
    const effectiveHover = hover || isRowHovered;

    return (
        <Tooltip title={text} placement="top">
            <Link
                to={`/posts/${recordId}`}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                    color: effectiveHover ? "#181C32" : "rgba(161, 165, 183, 1)",
                    fontWeight: 400,
                    display: "inline-block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: isMobile ? "130px" : "400px",
                    verticalAlign: "middle",
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "14px",
                    lineHeight: "14px",
                    transition: "color 0.3s"
                }}
            >
                {text}
            </Link>
        </Tooltip>
    );

};

const ActionButtons = ({ record, user, isMobile, actionLoading, handlePublishToggle, handleDelete }) => {
    const [publishHover, setPublishHover] = useState(false);
    const [deleteHover, setDeleteHover] = useState(false);
    const isOwner = user?.id === record?.author_id || user?.id === record?.author?.id;

    if (!isOwner) {
        return (
            <Tooltip title="Only the author can edit this post">
                <span style={{ color: "#A1A5B7", cursor: "text" }}>Read Only</span>
            </Tooltip>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 4 : 8 }}>
            <Button
                type="primary"
                size={isMobile ? "small" : "default"}
                onClick={() => handlePublishToggle(record)}
                loading={actionLoading?.id === record.id && actionLoading?.type === 'publish'}
                disabled={!!actionLoading}
                className="publish-btn"
                onMouseEnter={() => setPublishHover(true)}
                onMouseLeave={() => setPublishHover(false)}
                style={{
                    backgroundColor: (publishHover && !actionLoading) ? "#0958d9" : "#1677ff",
                    borderColor: (publishHover && !actionLoading) ? "#0958d9" : "#1677ff",
                    color: "#ffffff",
                    boxShadow: "none",
                    width: isMobile ? "100%" : 100,
                    fontSize: isMobile ? "12px" : "14px",
                    opacity: !!actionLoading ? 0.6 : 1,
                    cursor: !!actionLoading ? "not-allowed" : "pointer"
                }}
            >
                {record.is_published ? "Unpublish" : "Publish"}
            </Button>
            {!isMobile && (
                record.is_published ? (
                    <Tooltip title="Unpublish this post to delete it">
                        <span style={{ cursor: "not-allowed" }}>
                            <Button
                                danger
                                type="primary"
                                size="default"
                                style={{
                                    backgroundColor: "#F1416C",
                                    borderColor: "#F1416C",
                                    color: "#ffffff",
                                    fontSize: "14px",
                                    opacity: 1,
                                    cursor: "not-allowed"
                                }}
                            >
                                Delete
                            </Button>
                        </span>
                    </Tooltip>
                ) : (
                    <Popconfirm
                        title="Delete the post"
                        description="Are you sure to delete this post?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        disabled={!!actionLoading}
                    >
                        <Button
                            danger
                            type="primary"
                            size="default"
                            onMouseEnter={() => setDeleteHover(true)}
                            onMouseLeave={() => setDeleteHover(false)}
                            style={{
                                backgroundColor: (deleteHover && !actionLoading) ? "#C0264B" : "#F1416C",
                                borderColor: (deleteHover && !actionLoading) ? "#C0264B" : "#F1416C",
                                color: "#ffffff",
                                fontSize: "14px",
                                opacity: 1,
                                cursor: !!actionLoading ? "not-allowed" : "pointer"
                            }}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                )
            )}
        </div>
    );
};


const { useBreakpoint } = Grid;

const Posts = () => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const { user } = useSelector((state) => state.auth);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [actionLoading, setActionLoading] = useState(null);

    const [hoveredRowId, setHoveredRowId] = useState(null);
    const [createHover, setCreateHover] = useState(false);

    const fetchPosts = async (page = 1, size = 10, search = "") => {
        try {
            setLoading(true);
            const params = {
                page,
                size,
                search,

            };
            const res = await axiosInstance.get("/posts", { params });
            const data = res?.data?.data ?? [];
            const meta = res?.data?.meta ?? {};

            setPosts(data);
            setPagination({
                current: meta.page ?? page,
                pageSize: meta.size ?? size,
                total: meta.total ?? 0,
            });
        } catch (error) {
            console.error(error);
            message.error("Failed to fetch posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchPosts(pagination.current, pagination.pageSize, searchText);
        }
    }, [pagination.current, pagination.pageSize, searchText, user]);

    const handleTableChange = (page) => {
        setPagination((prev) => ({ ...prev, current: page.current, pageSize: page.pageSize }));
    };

    const handleDelete = async (id) => {
        try {
            setActionLoading({ id, type: 'delete' });
            await axiosInstance.delete(`/posts/${id}`);
            message.success("Post deleted successfully");
            fetchPosts(pagination.current, pagination.pageSize, searchText);
        } catch (error) {
            message.error(error?.response?.data?.message || "Failed to delete post");
        } finally {
            setActionLoading(null);
        }
    };

    const handlePublishToggle = async (record) => {
        try {
            setActionLoading({ id: record.id, type: 'publish' });
            const endpoint = record.is_published ? "unpublish" : "publish";
            await axiosInstance.patch(`/posts/${record.id}/${endpoint}`);
            message.success(`Post ${record.is_published ? "unpublished" : "published"} successfully`);
            fetchPosts(pagination.current, pagination.pageSize, searchText);
        } catch (error) {
            message.error(error?.response?.data?.message || "Action failed");
        } finally {
            setActionLoading(null);
        }
    };

    const headerStyle = {
        color: "rgba(63, 66, 84, 1)",
        fontFamily: "Roboto, sans-serif",
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "16px"
    };

    const bodyStyle = {
        color: "rgba(161, 165, 183, 1)",
        fontFamily: "Roboto, sans-serif",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "14px"
    };

    const columns = [
        {
            title: <span style={headerStyle}>Post Name</span>,
            dataIndex: "title",
            key: "title",
            width: isMobile ? "auto" : "40%",
            render: (text, record) => (
                <PostLink text={text} recordId={record.id} isMobile={isMobile} isRowHovered={record.id === hoveredRowId} />
            ),
        },
        {
            title: <span style={headerStyle}>Created at</span>,
            dataIndex: "createdAt",
            key: "createdAt",
            responsive: ["lg"],
            render: (date) => <span style={bodyStyle}>{dayjs(date).format("DD/MM/YYYY, h:mm a")}</span>,
        },
        {
            title: <span style={headerStyle}>Updated at</span>,
            dataIndex: "updatedAt",
            key: "updatedAt",
            responsive: ["xl"],
            render: (date) => <span style={bodyStyle}>{dayjs(date).format("DD/MM/YYYY, h:mm a")}</span>,
        },
        {
            title: <span style={headerStyle}>Actions</span>,
            key: "actions",
            render: (_, record) => {
                return (
                    <ActionButtons
                        record={record}
                        user={user}
                        isMobile={isMobile}
                        actionLoading={actionLoading}
                        handlePublishToggle={handlePublishToggle}
                        handleDelete={handleDelete}
                    />
                );
            },
        },
    ];

    return (
        <div style={{ minHeight: "100vh", background: "#f5f7fa", paddingTop: 76, overflow: "hidden" }}>
            <Header />
            <div style={{ padding: isMobile ? "12px 10px" : "24px 100px" }}>
                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", marginBottom: isMobile ? 12 : 24, gap: isMobile ? 12 : 0 }}>
                    <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 600, margin: 0 }}>Posts</h1>
                    <div style={{ display: 'flex', gap: isMobile ? 8 : 16, width: isMobile ? "100%" : "auto" }}>
                        <div style={{ width: isMobile ? "100%" : 250, flex: isMobile ? 1 : "none" }}>
                            <Search
                                onSearch={(value) => setSearchText(value)}
                                style={{ marginBottom: 0 }}
                                size={isMobile ? "middle" : "large"}
                            />
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setModalOpen(true)}
                            size={isMobile ? "middle" : "large"}
                            onMouseEnter={() => setCreateHover(true)}
                            onMouseLeave={() => setCreateHover(false)}
                            style={{
                                height: isMobile ? 32 : 40,
                                borderRadius: 6,
                                backgroundColor: createHover ? "#0958d9" : "#1677ff",
                                fontSize: isMobile ? 13 : 14
                            }}
                        >
                            Create
                        </Button>
                    </div>
                </div>

                <div style={{ background: "#fff", borderRadius: 12, padding: isMobile ? 12 : 24, boxShadow: "0px 0px 20px 0px rgba(76, 87, 125, 0.02)" }}>
                    {loading && posts.length === 0 ? (
                        <div style={{ width: '100%' }}>
                            <div style={{ display: 'flex', padding: '16px 16px', borderBottom: '1px solid #f0f0f0', marginBottom: 16 }}>
                                <div style={{ width: '40%' }}><Skeleton.Button active size="small" style={{ width: 100 }} /></div>
                                <div style={{ flex: 1 }}><Skeleton.Button active size="small" style={{ width: 100 }} /></div>
                                <div style={{ flex: 1 }}><Skeleton.Button active size="small" style={{ width: 100 }} /></div>
                                <div style={{ width: 150 }}><Skeleton.Button active size="small" style={{ width: 60 }} /></div>
                            </div>
                            {[...Array(5)].map((_, i) => (
                                <div key={i} style={{ display: 'flex', padding: '16px 16px', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
                                    <div style={{ width: '40%' }}>
                                        <Skeleton active title={false} paragraph={{ rows: 1, width: '90%' }} style={{ margin: 0 }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Skeleton active title={false} paragraph={{ rows: 1, width: '60%' }} style={{ margin: 0 }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Skeleton active title={false} paragraph={{ rows: 1, width: '60%' }} style={{ margin: 0 }} />
                                    </div>
                                    <div style={{ width: 150, display: 'flex', gap: 8 }}>
                                        <Skeleton.Button active size="default" style={{ width: 80, borderRadius: 6 }} />
                                        <Skeleton.Button active size="default" style={{ width: 80, borderRadius: 6 }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={posts}
                            rowKey="id"
                            loading={false}
                            pagination={{
                                simple: isMobile,
                                current: pagination.current,
                                pageSize: pagination.pageSize,
                                total: pagination.total,
                                showSizeChanger: !isMobile,
                                showTotal: (total, range) => isMobile ? null : `Total ${total} items`,
                                size: "small",
                            }}
                            onChange={handleTableChange}
                            scroll={{ x: true }}
                            size={isMobile ? "small" : "middle"}
                            onRow={(record) => ({
                                onMouseEnter: () => setHoveredRowId(record.id),
                                onMouseLeave: () => setHoveredRowId(null),
                            })}
                        />
                    )}
                </div>
            </div>

            <PostModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={() => fetchPosts(1, pagination.pageSize, searchText)}
            />
        </div>
    );
};

export default Posts;
