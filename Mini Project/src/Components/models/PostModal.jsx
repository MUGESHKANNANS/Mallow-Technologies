import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Upload, Button, message, Typography, Grid } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axiosInstance from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { updatePostRequest, createPostRequest } from "../../store/postSlice";

const { TextArea } = Input;
const { useBreakpoint } = Grid;

const PostModal = ({ open, onClose, onSuccess, postToEdit }) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { actionLoading, actionType } = useSelector((state) => state.post);
    const loading = actionLoading && (actionType === 'create' || actionType === 'update');
    const [fileList, setFileList] = useState([]);
    const [canSubmit, setCanSubmit] = useState(false);
    const [submitHover, setSubmitHover] = useState(false);

    const isEdit = !!postToEdit;

    useEffect(() => {
        if (open) {
            if (isEdit) {
                form.setFieldsValue({
                    title: postToEdit.title,
                    content: postToEdit.content,
                });
            } else {
                form.resetFields();
            }
            setFileList([]);
            setTimeout(updateCanSubmit, 0);
        }
    }, [open, postToEdit, form]);

    useEffect(() => {
        updateCanSubmit();
    }, [fileList]);

    const updateCanSubmit = () => {
        try {
            const title = form.getFieldValue("title");
            const content = form.getFieldValue("content");
            const hasFile = fileList.length > 0;
            const hasExistingImage = isEdit && !!postToEdit?.img_url;

            const valid = title && content && (hasFile || hasExistingImage);
            setCanSubmit(!!valid);
        } catch (e) {
            setCanSubmit(false);
        }
    };

    const handleFinish = async (values) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("content", values.content);

        if (fileList.length > 0) {
            formData.append("file", fileList[0]);
        } else if (!isEdit) {
            message.warning("Please choose an image!");
            return;
        }

        if (isEdit) {
            dispatch(updatePostRequest({
                id: postToEdit.id,
                formData,
                onSuccess: () => {
                    onSuccess();
                    onClose();
                }
            }));
        } else {
            dispatch(createPostRequest({
                formData,
                onSuccess: () => {
                    form.resetFields();
                    setFileList([]);
                    onSuccess();
                    onClose();
                }
            }));
        }
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
            return Upload.LIST_IGNORE;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Image must smaller than 2MB!");
            return Upload.LIST_IGNORE;
        }
        setFileList([file]);
        return false;
    };
    const showPreview = fileList.length > 0 || (isEdit && postToEdit?.img_url);
    const previewUrl = fileList.length > 0 ? URL.createObjectURL(fileList[0]) : postToEdit?.img_url;
    return (
        <Modal
            open={open}
            onCancel={!loading ? onClose : undefined}
            footer={null}
            width={isMobile ? "95%" : 600}
            maskClosable={!loading}
            keyboard={!loading}
            closable={!loading}
            title={<span style={{ fontSize: 20, fontWeight: 600 }}>{isEdit ? "Edit Post" : "Create Post"}</span>}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                onValuesChange={updateCanSubmit}
                style={{ marginTop: 20 }}
                requiredMark={false}
            >
                <Form.Item
                    label={<>Blog Title <span style={{ color: "red" }}>*</span></>}
                    name="title"
                    rules={[
                        { required: true, message: "Please enter blog title" },
                        { min: 5, message: "Title must be at least 5 characters" },
                        { max: 200, message: "Title cannot exceed 200 characters" }
                    ]}
                >
                    <Input placeholder="Enter title" size="large" disabled={loading} style={{ borderRadius: 6 }} />
                </Form.Item>

                <Form.Item
                    label={<>Cover Image <span style={{ color: "red" }}>*</span></>}
                    name="file"
                >
                    <Upload
                        beforeUpload={beforeUpload}
                        showUploadList={false}
                        accept=".jpg,.jpeg,.png"
                        maxCount={1}
                        style={{ width: "100%" }}
                        disabled={loading}
                    >
                        <div
                            style={{
                                height: 50,
                                width: "100%",
                                borderRadius: 6,
                                background: "#fff",
                                display: "flex",
                                alignItems: "center",
                                padding: "0 12px",
                                justifyContent: "space-between",
                                cursor: loading ? "not-allowed" : "pointer",
                                border: "1px solid #d9d9d9"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden", flex: 1 }}>
                                {showPreview && (
                                    <img
                                        src={previewUrl}
                                        alt="preview"
                                        style={{ width: 30, height: 30, borderRadius: 4, objectFit: "cover" }}
                                    />
                                )}
                                <span style={{ color: "#999", fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {showPreview ? "Change Image" : "Choose Image"}
                                </span>
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                                <Button type="primary" disabled={loading} style={{ height: 32, borderRadius: 6, backgroundColor: "#3E97FF", color: "#fff", opacity: loading ? 0.5 : 1 }}>
                                    {showPreview ? "Change" : "Choose"}
                                </Button>
                                {fileList.length > 0 && (
                                    <Button
                                        danger
                                        disabled={loading}
                                        style={{ height: 32, width: 32, padding: 0, borderRadius: 6 }}
                                        icon={<DeleteOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFileList([]);
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </Upload>
                </Form.Item>

                <Form.Item
                    label={<>Content <span style={{ color: "red" }}>*</span></>}
                    name="content"
                    rules={[{ required: true, message: "Please enter content" }]}
                >
                    <TextArea
                        rows={6}
                        placeholder="Enter your content here..."
                        disabled={loading}
                        style={{ borderRadius: 6 }}
                        onKeyDown={(e) => {
                            if ((e.key === 'Enter' && !e.shiftKey) || (e.key === 'Enter' && e.ctrlKey)) {
                                e.preventDefault();
                                form.submit();
                            }
                        }}
                    />
                </Form.Item>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            if (!loading) onClose();
                        }}
                        size={isMobile ? "middle" : "large"}
                        style={{
                            borderRadius: 6,
                            fontSize: isMobile ? 12 : 14,
                            opacity: 1,
                            cursor: loading ? "not-allowed" : "pointer"
                        }}
                        htmlType="button"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        size={isMobile ? "middle" : "large"}
                        disabled={!canSubmit || loading}
                        onMouseEnter={() => setSubmitHover(true)}
                        onMouseLeave={() => setSubmitHover(false)}
                        style={{
                            borderRadius: 6,
                            backgroundColor: (canSubmit && !loading && submitHover) ? "#0958d9" : "#1677ff",
                            color: "#fff",
                            fontSize: isMobile ? 12 : 14,
                            opacity: 1,
                            cursor: (!canSubmit) ? "not-allowed" : "pointer"
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default PostModal;
