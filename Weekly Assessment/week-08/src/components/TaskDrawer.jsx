import React, { forwardRef, useEffect } from "react";
import { Drawer, Form, Input, Select, Space, Button } from "antd";

const { Option } = Select;

function normalizeStatus(status) {
  if (!status) return undefined;

  const value = String(status).toLowerCase();

  if (value.includes("not")) return "Not Started";
  if (value.includes("progress")) return "In-Progress";
  return "Completed";
}

const TaskDrawer = forwardRef(function TaskDrawer(
  { open, editItem, onClose, onFinish, submitting },
  ref
) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;

    if (editItem) {
      form.setFieldsValue({
        todo: editItem.todo,
        status: normalizeStatus(editItem.status),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: "Not Started" });
    }
  }, [open, editItem, form]);

  const handleFinish = (values) => {
    onFinish(values);
  };

  return (
    <Drawer
      title={editItem ? "Edit Todo" : "Add Todo"}
      width={520}
      open={open}
      onClose={submitting ? null : onClose}
      maskClosable={!submitting}
      destroyOnClose={false}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{ status: "Not Started" }}
        onFinish={handleFinish}
      >
        <Form.Item
          name="todo"
          label="Todo"
          rules={[{ required: true, message: "Please enter todo name" }]}
        >
          <Input placeholder="Todo name" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select>
            <Option value="Completed">Completed</Option>
            <Option value="In-Progress">In-Progress</Option>
            <Option value="Not Started">Not Started</Option>
          </Select>
        </Form.Item>

        <Form.Item shouldUpdate>
        {() => {
            const { todo, status } = form.getFieldsValue(["todo", "status"]);
            const hasErrors = form
            .getFieldsError()
            .some((field) => field.errors && field.errors.length > 0);

            const isFilled =
            typeof todo === "string" &&
            todo.trim() !== "" &&
            typeof status === "string" &&
            status.trim() !== "";

            const isChanged =
            !editItem ||
            todo !== editItem.todo ||
            normalizeStatus(status) !== normalizeStatus(editItem.status);

            const disabled = hasErrors || !isFilled || submitting || !isChanged;

            return (
            <Space>
                <Button onClick={onClose} disabled={submitting}>
                Cancel
                </Button>
                <Button
                type="primary"
                htmlType="submit"
                disabled={disabled}
                loading={submitting}
                >
                {editItem ? "Update" : "Create"}
                </Button>
            </Space>
            );
        }}
        </Form.Item>

      </Form>
    </Drawer>
  );
});

export default TaskDrawer;
