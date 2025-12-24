import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, Space, message, Grid } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axiosInstance from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../store/authSlice";

const { useBreakpoint } = Grid;


const ProfileModal = ({ open, onClose }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);
  const dispatch = useDispatch();
  const { user: prevUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        first_name: prevUser?.first_name ?? "",
        last_name: prevUser?.last_name ?? "",
      });
      setFile(null);
      setTimeout(updateCanSubmit, 0);
    }
  }, [open, prevUser]);

  useEffect(() => {
    updateCanSubmit();
  }, [file, loading]);

  const ACCEPTED_FORMATS = [
    "image/jpeg",
    "image/png",
  ];
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const validateFile = (f) => {
    if (!f || !f.type) return false;

    if (!ACCEPTED_FORMATS.includes(f.type)) {
      message.error("Unsupported file type. Use JPG or PNG only.");
      return false;
    }

    if (f.size > MAX_FILE_SIZE) {
      message.error("File is too large. Maximum size is 5 MB.");
      return false;
    }

    return true;
  };

  const updateCanSubmit = () => {
    try {
      const first = form.getFieldValue("first_name") ?? "";
      const last = form.getFieldValue("last_name") ?? "";

      const firstChanged = prevUser ? first !== prevUser.first_name : first.trim() !== "";
      const lastChanged = prevUser ? last !== prevUser.last_name : last.trim() !== "";
      const fileChanged = Boolean(file);

      const firstErrors = form.getFieldError("first_name");
      const lastErrors = form.getFieldError("last_name");

      const fieldsValid = first && last && firstErrors.length === 0 && lastErrors.length === 0;

      const hasImage = Boolean(file) || Boolean(prevUser?.img_url);

      setCanSubmit((firstChanged || lastChanged || fileChanged) && fieldsValid && hasImage && !loading);
    } catch (e) {
      setCanSubmit(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      if (!file && !prevUser?.img_url) {
        message.error("Profile image is required");
        setLoading(false);
        return;
      }

      if (file && !validateFile(file)) {
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      if (file) formData.append("file", file);

      const res = await axiosInstance.put("/user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const payload = res?.data;
      let updatedUser =
        payload?.user ??
        payload?.data?.user ??
        payload?.data?.details ??
        payload?.data ??
        payload;

      try {
        if (prevUser?.img_url && updatedUser?.img_url && prevUser.img_url === updatedUser.img_url) {
          const sep = updatedUser.img_url.includes("?") ? "&" : "?";
          updatedUser = {
            ...updatedUser,
            img_url: `${updatedUser.img_url}${sep}t=${Date.now()}`,
          };
        }
      } catch (e) {

      }

      if (process.env.NODE_ENV === "development") {
        console.log("Profile updated response payload:", payload, "=> user:", updatedUser);
      }

      dispatch(updateUser(updatedUser));

      try {
        const storedAuth = JSON.parse(localStorage.getItem("auth") || "{}");
        if (storedAuth && (storedAuth.user || storedAuth.token)) {
          localStorage.setItem("auth", JSON.stringify({ ...storedAuth, user: updatedUser }));
        }
      } catch (e) {
      }

      message.success("Profile updated successfully");
      onClose();
      form.resetFields();
      setFile(null);
    } catch (err) {
      message.error(
        err?.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={!loading ? onClose : undefined}
      footer={null}
      style={{ top: 117 }}
      zIndex={2000}
      width={isMobile ? "95%" : 436}
      closeIcon={!loading}
      maskClosable={!loading}
    >
      <h3 style={{ marginBottom: 24 }}>Profile</h3>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        onValuesChange={updateCanSubmit}
        requiredMark={false}
      >
        <div style={{ width: "100%", margin: "0 auto" }}>
          <Form.Item
            label={<>First Name <span style={{ color: "red" }}>*</span></>}
            name="first_name"
            rules={[
              { required: true, message: "First name is required" },
              { min: 2, message: "Minimum 2 characters" },
              { max: 30, message: "Maximum 30 characters" },
              { pattern: /^[A-Za-z ]+$/, message: "Only letters allowed" },
            ]}
          >
            <Input
              disabled={loading}
              style={{
                height: 48,
                width: "100%",
                borderRadius: 6,
                background: "rgba(241,241,242,1)",
              }}
            />
          </Form.Item>

          <Form.Item
            label={<>Last Name <span style={{ color: "red" }}>*</span></>}
            name="last_name"
            rules={[
              { required: true, message: "Last name is required" },
              { max: 30, message: "Maximum 30 characters" },
              { pattern: /^[A-Za-z ]+$/, message: "Only letters allowed" },
            ]}
          >
            <Input
              disabled={loading}
              style={{
                height: 48,
                width: "100%",
                borderRadius: 6,
                background: "rgba(241,241,242,1)",
              }}
            />
          </Form.Item>

          <Form.Item
            label={<>Profile Image <span style={{ color: "red" }}>*</span></>}
            name="file"
            rules={[
              { required: false },
            ]}
          >
            <Upload
              accept="image/jpeg,image/png"
              beforeUpload={(f) => {
                if (!validateFile(f)) {
                  setFile(null);
                  form.setFieldsValue({ file: undefined });
                  return false;
                }
                setFile(f);
                form.setFieldsValue({ file: f });
                return false;
              }}
              showUploadList={false}
              disabled={loading}
              style={{ width: "100%", display: 'block' }} // Ensure Upload wrapper takes full width
            >
              <div
                style={{
                  height: 48,
                  width: "100%",
                  borderRadius: 6,
                  background: "rgba(241,241,242,1)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 12px",
                  justifyContent: "space-between",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden", flex: 1, minWidth: 0 }}>
                  {!file && prevUser?.img_url && (
                    <img
                      src={prevUser.img_url}
                      alt="Current"
                      style={{ width: 30, height: 30, borderRadius: 4, objectFit: "cover" }}
                    />
                  )}
                  <span style={{ color: file ? "#000" : "#999", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {file ? file.name : (prevUser?.img_url ? "Change Image" : "Choose Image")}
                  </span>
                </div>

                <Space>
                  <Button
                    type="primary"
                    disabled={loading}
                    style={{
                      width: 99,
                      height: 30,
                      borderRadius: 6,
                      background: "rgba(62,151,255,1)",
                    }}
                  >
                    {file || prevUser?.img_url ? "Change" : "Choose"}
                  </Button>

                  {file && !loading && (
                    <Button
                      icon={<DeleteOutlined />}
                      size="small"
                      danger
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        form.setFieldsValue({ file: undefined });
                        setTimeout(updateCanSubmit, 0);
                      }}
                    />
                  )}
                </Space>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <div
              style={{
                width: "100%",
                margin: "0 auto",
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <Button
                onClick={() => {
                  if (!loading) onClose();
                }}
                style={{
                  width: 100,
                  height: isMobile ? 32 : 40,
                  borderRadius: 6,
                  background: "#f3f4f6",
                  fontSize: isMobile ? 12 : 14,
                  opacity: 1,
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                Cancel
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={!canSubmit || loading}
                onMouseEnter={() => setSubmitHover(true)}
                onMouseLeave={() => setSubmitHover(false)}
                style={{
                  width: 100,
                  height: isMobile ? 32 : 40,
                  borderRadius: 6,
                  color: "#fff",
                  backgroundColor: (canSubmit && !loading && submitHover) ? "#0958d9" : "#1677ff",
                  fontSize: isMobile ? 12 : 14,
                  opacity: 1,
                  cursor: (!canSubmit) ? "not-allowed" : "pointer"
                }}
              >
                Submit
              </Button>
            </div>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ProfileModal;
