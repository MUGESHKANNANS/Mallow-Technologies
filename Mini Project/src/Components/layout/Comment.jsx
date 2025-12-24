import React, { useState } from "react";
import { Avatar, Input, Button, List, Typography, message, Card, Popconfirm, Skeleton, Grid } from "antd";
import { UserOutlined, SendOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axiosInstance from "../../utils/axiosInstance";

dayjs.extend(relativeTime);

const { Text } = Typography;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

const Comment = ({ postId, comments = [], onCommentAdded, hasMore, loadingComments, onLoadMore }) => {
    const { user } = useSelector((state) => state.auth);
    const screens = useBreakpoint();
    const isMobile = !screens.sm;

    const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [hoveredCommentId, setHoveredCommentId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [actionLoading, setActionLoading] = useState(null);
    const [tick, setTick] = useState(0);
    const [postHover, setPostHover] = useState(false);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTick(t => t + 1);
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const handleSubmit = async () => {
        if (!commentText.trim()) return;

        try {
            setSubmitting(true);
            await axiosInstance.post(`/posts/${postId}/comments`, {
                content: commentText.trim(),
            });
            message.success("Comment added successfully");
            setCommentText("");
            setTimeout(() => setCommentText(""), 0);
            if (onCommentAdded) onCommentAdded();
        } catch (error) {
            console.error(error);
            message.error(error?.response?.data?.message || "Failed to add comment");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = (comment) => {
        setEditingId(comment.id);
        setEditContent(comment.content);
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditContent("");
    };

    const handleEditSave = async (commentId) => {
        if (!editContent.trim()) return;
        try {
            setActionLoading(commentId);
            await axiosInstance.put(`/posts/${postId}/comments/${commentId}`, { content: editContent.trim() });
            message.success("Comment updated successfully");
            setEditingId(null);
            if (onCommentAdded) onCommentAdded();
        } catch (error) {
            console.error("Update failed:", error);
            console.log("Error response:", error?.response);
            message.error(error?.response?.data?.message || "Failed to update comment");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            setActionLoading(commentId);
            await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
            message.success("Comment deleted successfully");
            if (onCommentAdded) onCommentAdded();
        } catch (error) {
            console.error(error);
            message.error(error?.response?.data?.message || "Failed to delete comment");
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (date) => {
        const d = dayjs(date);
        const diffWeeks = dayjs().diff(d, 'week');
        if (diffWeeks >= 4) {
            return d.format("D MMM YYYY, h:mm A");
        }
        return d.fromNow();
    };

    return (
        <div style={{ marginTop: isMobile ? 16 : 24 }}>
            <Text strong style={{ fontSize: 16 }}>Comments ({comments.length})</Text>

            <div style={{ marginTop: 16, display: "flex", gap: isMobile ? 8 : 12 }}>
                <Avatar
                    src={user?.img_url}
                    icon={<UserOutlined />}
                    size={isMobile ? 32 : 40}
                    shape="square"
                    style={{ borderRadius: 9, flexShrink: 0 }}
                />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                    <TextArea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        autoSize={{ minRows: 3 }}
                        style={{ borderRadius: 6, fontSize: 16 }}
                        disabled={submitting}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (commentText.trim() && !submitting) handleSubmit();
                            } else if (e.key === 'Enter' && e.ctrlKey) {
                                e.preventDefault();
                                if (commentText.trim() && !submitting) handleSubmit();
                            }
                        }}
                    />
                    <div style={{ display: "flex", flexDirection: "row", gap: 12, justifyContent: "flex-end" }}>
                        <Button

                            onClick={() => {
                                if (!submitting && commentText.trim()) setCommentText("");
                            }}
                            style={{
                                width: isMobile ? "50%" : 120,
                                height: isMobile ? 32 : 40,
                                borderRadius: 6,
                                flex: isMobile ? 1 : "none",
                                fontSize: isMobile ? 13 : 14,
                                opacity: 1,
                                cursor: (submitting || !commentText.trim()) ? "not-allowed" : "pointer"
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={handleSubmit}
                            loading={submitting}
                            onMouseEnter={() => setPostHover(true)}
                            onMouseLeave={() => setPostHover(false)}
                            style={{
                                width: isMobile ? "50%" : 120,
                                height: isMobile ? 32 : 40,
                                borderRadius: 6,
                                backgroundColor: (commentText.trim() && !submitting && postHover) ? "#0958d9" : "#1677ff",
                                color: "white",
                                opacity: 1,
                                cursor: (!commentText.trim()) ? "not-allowed" : "pointer",
                                flex: isMobile ? 1 : "none",
                                fontSize: isMobile ? 13 : 14
                            }}
                        >
                            Post
                        </Button>
                    </div>
                </div>
            </div>

            {loadingComments && comments.length === 0 ? (
                <div style={{ marginTop: isMobile ? 16 : 24 }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} style={{ padding: isMobile ? "12px 0" : "16px 0", borderBottom: "1px solid #f0f0f0", display: "flex", gap: isMobile ? 12 : 16 }}>
                            <Skeleton.Avatar active size={32} shape="square" style={{ borderRadius: 9 }} />
                            <div style={{ flex: 1 }}>
                                <Skeleton active title={{ width: 120 }} paragraph={{ rows: 2 }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <List
                    style={{ marginTop: isMobile ? 16 : 24 }}
                    dataSource={[...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
                    itemLayout="horizontal"
                    locale={{ emptyText: "No comments yet" }}
                    loadMore={
                        hasMore ? (
                            <div
                                style={{
                                    textAlign: 'center',
                                    marginTop: 12,
                                    height: 32,
                                    lineHeight: '32px',
                                }}
                            >
                                {loadingComments ? (
                                    <div style={{ marginTop: isMobile ? 16 : 24 }}>
                                        {[1, 2].map((i) => (
                                            <div key={i} style={{ padding: isMobile ? "12px 0" : "16px 0", borderBottom: "1px solid #f0f0f0", display: "flex", gap: isMobile ? 12 : 16, textAlign: 'left' }}>
                                                <Skeleton.Avatar active size={32} shape="square" style={{ borderRadius: 9 }} />
                                                <div style={{ flex: 1 }}>
                                                    <Skeleton active title={{ width: 120 }} paragraph={{ rows: 2 }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <Button onClick={onLoadMore}>Load More</Button>
                                )}
                            </div>
                        ) : null
                    }
                    renderItem={(item) => {
                        const isOwner = user?.id === item?.author?.id;
                        const isHovered = hoveredCommentId === item.id;

                        return (
                            <List.Item
                                style={{
                                    padding: isMobile ? "12px 0" : "16px",
                                    borderBottom: "1px solid #f0f0f0",
                                    display: isMobile ? 'block' : 'flex',
                                    backgroundColor: isHovered ? "#f9f9f9" : "transparent",
                                    transition: "background-color 0.3s",
                                    borderRadius: 8
                                }}
                                onMouseEnter={() => setHoveredCommentId(item.id)}
                                onMouseLeave={() => setHoveredCommentId(null)}
                            >
                                {isMobile ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <Avatar src={item?.author?.img_url} icon={<UserOutlined />} size={32} style={{ borderRadius: 9, flexShrink: 0 }} />
                                            <Text strong>{item?.author?.first_name} {item?.author?.last_name}</Text>
                                        </div>

                                        {/* Mobile Content */}

                                        <div style={{ paddingLeft: 44 }}>
                                            {editingId === item.id ? (
                                                <div>
                                                    <TextArea
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        autoSize={{ minRows: 2, maxRows: 6 }}
                                                        style={{ marginBottom: 8 }}
                                                        disabled={actionLoading === item.id}
                                                    />
                                                    <div style={{ display: "flex", gap: 8 }}>
                                                        <Button type="primary" size="small" onClick={() => handleEditSave(item.id)} loading={actionLoading === item.id} style={{ backgroundColor: "#3E97FF" }}>Save</Button>
                                                        <Button size="small" onClick={handleEditCancel} disabled={actionLoading === item.id}>Cancel</Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Text style={{ color: "#5E6278", whiteSpace: "pre-wrap" }}>{item.content}</Text>
                                            )}
                                        </div>

                                        {/* Mobile Footer: Date + Actions */}

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 44 }}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {item.updatedAt && item.updatedAt !== item.createdAt
                                                    ? `${formatDate(item.updatedAt)} (Edited)`
                                                    : formatDate(item.createdAt)
                                                }
                                            </Text>
                                            {isOwner && editingId !== item.id && (
                                                <div style={{ display: 'flex', gap: 0 }}>
                                                    <Button type="text" icon={<EditOutlined style={{ color: '#5E6278' }} />} onClick={() => handleEditClick(item)} disabled={actionLoading === item.id} size="small" />
                                                    <Popconfirm title="Delete comment" description="Are you sure?" onConfirm={() => handleDelete(item.id)} okText="Yes" cancelText="No" disabled={actionLoading === item.id}>
                                                        <Button type="text" danger icon={<DeleteOutlined />} loading={actionLoading === item.id} size="small" />
                                                    </Popconfirm>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ flex: 1, marginRight: 16 }}>
                                            <List.Item.Meta
                                                avatar={<Avatar src={item?.author?.img_url} icon={<UserOutlined />} style={{ borderRadius: 9 }} />}
                                                title={<Text strong>{item?.author?.first_name} {item?.author?.last_name}</Text>}
                                                description={
                                                    editingId === item.id ? (
                                                        <div style={{ marginTop: 8 }}>
                                                            <TextArea
                                                                value={editContent}
                                                                onChange={(e) => setEditContent(e.target.value)}
                                                                autoSize={{ minRows: 2, maxRows: 6 }}
                                                                style={{ marginBottom: 8 }}
                                                                disabled={actionLoading === item.id}
                                                            />
                                                            <div style={{ display: "flex", gap: 8 }}>
                                                                <Button type="primary" size="small" onClick={() => handleEditSave(item.id)} loading={actionLoading === item.id} style={{ backgroundColor: "#3E97FF" }}>Save</Button>
                                                                <Button size="small" onClick={handleEditCancel} disabled={actionLoading === item.id}>Cancel</Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div style={{ marginTop: 4 }}>
                                                            <Text style={{ color: "#5E6278", whiteSpace: "pre-wrap" }}>{item.content}</Text>
                                                        </div>
                                                    )
                                                }
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {item.updatedAt && item.updatedAt !== item.createdAt
                                                    ? `${formatDate(item.updatedAt)} (Edited)`
                                                    : formatDate(item.createdAt)
                                                }
                                            </Text>
                                            {isOwner && editingId !== item.id && (
                                                <div style={{ display: 'flex', gap: 0, opacity: isHovered ? 1 : 0, transition: "opacity 0.2s" }}>
                                                    <Button type="text" icon={<EditOutlined style={{ color: '#5E6278' }} />} onClick={() => handleEditClick(item)} disabled={actionLoading === item.id} size="small" />
                                                    <Popconfirm title="Delete comment" description="Are you sure to delete this comment?" onConfirm={() => handleDelete(item.id)} okText="Yes" cancelText="No" disabled={actionLoading === item.id}>
                                                        <Button type="text" danger icon={<DeleteOutlined />} loading={actionLoading === item.id} size="small" />
                                                    </Popconfirm>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </List.Item>
                        );
                    }}
                />
            )}
        </div>
    );
};

export default Comment;
