import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Typography, Popconfirm, Skeleton, Tooltip, Grid } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { fetchPostRequest, deletePostRequest, togglePublishRequest, clearPostState } from '../store/postSlice';
import PostModal from '../Components/models/PostModal';
import Comment from '../Components/layout/Comment';
import axiosInstance from '../utils/axiosInstance';

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const PostPreview = () => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { currentPost, loading, actionLoading, actionType } = useSelector(state => state.post);

    const [modalOpen, setModalOpen] = useState(false);
    const [deleteHover, setDeleteHover] = useState(false);
    const [editHover, setEditHover] = useState(false);
    const [publishHover, setPublishHover] = useState(false);
    const [backHover, setBackHover] = useState(false);

    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchComments = async (postId, postData = null, pageNum = 1) => {
        if (pageNum === 1) {
            setHasMore(true);
        }
        setLoadingComments(true);

        try {
            const res = await axiosInstance.get(`/posts/${postId}/comments`, {
                params: { page: pageNum, size: 5, t: Date.now(), sort: 'desc' }
            });
            const data = res?.data?.data ?? res?.data ?? [];
            const meta = res?.data?.meta;

            const newComments = Array.isArray(data) ? data : [];

            if (pageNum === 1) {
                setComments(newComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } else {
                setComments(prev => {
                    const combined = [...prev, ...newComments];
                    return combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
                const source = postData || currentPost;
                if (source && Array.isArray(source.comments)) {
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

    useEffect(() => {
        if (id) {
            dispatch(fetchPostRequest(id));
            setComments([]);
            setPage(1);
        }
        return () => {
            dispatch(clearPostState());
        };
    }, [dispatch, id]);
    useEffect(() => {
        if (currentPost && currentPost.id) {
            fetchComments(currentPost.id, currentPost, 1);
        }
    }, [currentPost?.id]);

    if (loading || !currentPost) {
        return (
            <div style={{ minHeight: '100vh', background: '#f5f7fa', display: 'flex', justifyContent: 'center', paddingTop: isMobile ? 4 : 155, paddingBottom: isMobile ? 20 : 154, paddingLeft: isMobile ? 16 : 0, paddingRight: isMobile ? 16 : 0 }}>
                <Card
                    style={{
                        width: isMobile ? "95%" : 867,
                        height: isMobile ? "auto" : 762,
                        borderRadius: 12,
                        border: 'none',
                        margin: isMobile ? "0 auto" : 0
                    }}
                    styles={{ body: { padding: isMobile ? 20 : 40 } }}
                >
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', marginBottom: 24, gap: isMobile ? 12 : 0 }}>
                        <Skeleton.Button active size={isMobile ? "small" : "default"} style={{ width: isMobile ? 60 : 80, height: isMobile ? 28 : 32, borderRadius: 6 }} />
                        <div style={{ display: 'flex', gap: isMobile ? 8 : 12 }}>
                            <Skeleton.Button active size={isMobile ? "small" : "default"} style={{ width: isMobile ? 60 : 80, height: isMobile ? 32 : 38, borderRadius: 6 }} />
                            <Skeleton.Button active size={isMobile ? "small" : "default"} style={{ width: isMobile ? 50 : 60, height: isMobile ? 32 : 38, borderRadius: 6 }} />
                            <Skeleton.Button active size={isMobile ? "small" : "default"} style={{ width: isMobile ? 80 : 100, height: isMobile ? 32 : 38, borderRadius: 6 }} />
                        </div>
                    </div>
                    <Skeleton.Node active style={{ width: '100%', height: isMobile ? 200 : 320, borderRadius: 12, marginBottom: 24 }}>
                        <div />
                    </Skeleton.Node>
                    <Skeleton active title={{ width: '60%', style: { height: 28, marginBottom: 16 } }} paragraph={false} />
                    <Skeleton active title={false} paragraph={{ rows: 6, width: '100%' }} />
                </Card>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f5f7fa', display: 'flex', justifyContent: 'center', paddingTop: isMobile ? 4 : 155, paddingBottom: isMobile ? 20 : 154, paddingLeft: isMobile ? 16 : 0, paddingRight: isMobile ? 16 : 0 }}>
            <Card
                style={{
                    width: isMobile ? "95%" : 867,
                    minHeight: 762,
                    height: "auto",
                    boxShadow: 'rgba(0, 0, 0, 0.03) 0 3px 4px 0',
                    borderRadius: 12,
                    border: 'none',
                    margin: isMobile ? "0 auto" : 0
                }}
                styles={{ body: { padding: isMobile ? 20 : 40, height: '100%', display: 'flex', flexDirection: 'column' } }}
            >
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: 24, gap: isMobile ? 16 : 0 }}>
                    <Button
                        icon={<LeftOutlined />}
                        onClick={() => navigate('/posts')}
                        onMouseEnter={() => setBackHover(true)}
                        onMouseLeave={() => setBackHover(false)}
                        style={{
                            background: backHover ? '#dff1ff' : '#f5f7fa',
                            border: 'none',
                            color: backHover ? '#3E97FF' : '#7E8299',
                            borderRadius: 6,
                            fontWeight: 500,
                            height: isMobile ? 28 : 48,
                            width: isMobile ? "auto" : 98,
                            fontSize: isMobile ? 13 : 14,
                            transition: 'all 0.3s'
                        }}
                    >
                        Back
                    </Button>
                    <div style={{ display: 'flex', gap: isMobile ? 8 : 12, flexWrap: "wrap" }}>
                        {(user?.id === currentPost?.author_id || user?.id === currentPost?.author?.id) && (
                            <>
                                {currentPost.is_published ? (
                                    <Tooltip title="Unpublish this post to delete it">
                                        <span style={{ cursor: 'not-allowed' }}>
                                            <Button
                                                danger
                                                type="primary"
                                                size={isMobile ? "small" : "default"}
                                                style={{ borderRadius: 6, backgroundColor: "#F1416C", borderColor: "#F1416C", height: isMobile ? 32 : 38, opacity: 1, color: "#ffffff", fontSize: isMobile ? 12 : 14, cursor: "not-allowed" }}
                                            >
                                                Delete
                                            </Button>
                                        </span>
                                    </Tooltip>
                                ) : (
                                    <Popconfirm
                                        title="Delete the post"
                                        description="Are you sure to delete this post?"
                                        onConfirm={() => dispatch(deletePostRequest({ id: currentPost.id, onSuccess: () => navigate('/posts') }))}
                                        okText="Yes"
                                        cancelText="No"
                                        disabled={!!actionLoading}
                                    >
                                        <Button
                                            danger
                                            type="primary"
                                            loading={actionLoading && actionType === 'delete'}
                                            size={isMobile ? "small" : "default"}
                                            onMouseEnter={() => setDeleteHover(true)}
                                            onMouseLeave={() => setDeleteHover(false)}
                                            style={{
                                                borderRadius: 6,
                                                backgroundColor: (deleteHover && !actionLoading) ? "#C0264B" : "#F1416C",
                                                borderColor: (deleteHover && !actionLoading) ? "#C0264B" : "#F1416C",
                                                height: isMobile ? 32 : 38,
                                                opacity: 1,
                                                color: "#ffffff",
                                                fontSize: isMobile ? 12 : 14,
                                                cursor: !!actionLoading ? "not-allowed" : "pointer"
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Popconfirm>
                                )}
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        if (!actionLoading) setModalOpen(true);
                                    }}
                                    size={isMobile ? "small" : "default"}
                                    onMouseEnter={() => setEditHover(true)}
                                    onMouseLeave={() => setEditHover(false)}
                                    style={{
                                        borderRadius: 6,
                                        backgroundColor: (editHover && !actionLoading) ? "#0958d9" : "#1677ff",
                                        height: isMobile ? 32 : 38,
                                        opacity: 1,
                                        color: "#ffffff",
                                        fontSize: isMobile ? 12 : 14,
                                        cursor: !!actionLoading ? "not-allowed" : "pointer"
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    type="primary"
                                    loading={actionLoading && actionType === 'publish'}
                                    size={isMobile ? "small" : "default"}
                                    onClick={() => {
                                        if (!actionLoading) dispatch(togglePublishRequest({ id: currentPost.id, is_published: currentPost.is_published }));
                                    }}
                                    onMouseEnter={() => setPublishHover(true)}
                                    onMouseLeave={() => setPublishHover(false)}
                                    style={{
                                        borderRadius: 6,
                                        backgroundColor: (publishHover && !actionLoading) ? "#0958d9" : "#1677ff",
                                        height: isMobile ? 32 : 38,
                                        width: isMobile ? "auto" : 100,
                                        opacity: 1,
                                        color: "#ffffff",
                                        fontSize: isMobile ? 12 : 14,
                                        cursor: !!actionLoading ? "not-allowed" : "pointer"
                                    }}
                                >
                                    {currentPost.is_published ? "Unpublish" : "Publish"}
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <img
                        src={currentPost.img_url}
                        alt={currentPost.title}
                        style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 12, marginBottom: 24 }}
                    />
                    <Title level={3} style={{ marginBottom: 16, fontSize: 22, fontWeight: 600, color: '#181C32' }}>{currentPost.title}</Title>
                    <Paragraph style={{ fontSize: 16, color: '#5E6278', lineHeight: '24px', whiteSpace: 'pre-wrap' }}>
                        {currentPost.content}
                    </Paragraph>

                    <div style={{ marginTop: 40, borderTop: "1px solid #f0f0f0", paddingTop: 24 }}>
                        <Comment
                            postId={currentPost.id}
                            comments={comments}
                            loadingComments={loadingComments}
                            hasMore={hasMore}
                            onLoadMore={() => fetchComments(currentPost.id, currentPost, page + 1)}
                            onCommentAdded={() => fetchComments(currentPost.id, currentPost, 1)}
                        />
                    </div>
                </div>
            </Card>

            <PostModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                postToEdit={currentPost}
                onSuccess={() => dispatch(fetchPostRequest(id))}
            />
        </div>
    );
};

export default PostPreview;
