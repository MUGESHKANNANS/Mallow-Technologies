import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Drawer, Form, Input, DatePicker, Select, Space, Button } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const TaskDrawer = forwardRef(function TaskDrawer(
  { open, editItem, onClose, onFinish },
  ref
) {
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    reset: () => form.resetFields(),
    getForm: () => form,
  }));

  useEffect(() => {
    if (!open) return;

    if (editItem) {
      form.setFieldsValue({
        name: editItem.name,
        task: editItem.task,
        due: editItem.due ? dayjs(editItem.due) : null,
        status: editItem.status,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: "Not Started" });
    }
  }, [open, editItem, form]);

  const finishHandler = (values) => {
    onFinish(values);
  };

  return (
    <Drawer
      title={editItem ? "Edit Task" : "Add Task"}
      size={520}
      open={open}
      onClose={onClose}
      destroyOnClose={false}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{ status: "Not Started" }}
        onFinish={finishHandler}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: "Please enter a name" },
            { pattern: /^[A-Za-z ]+$/, message: "Only letters allowed" },
          ]}
        >
          <Input placeholder="Person's name" />
        </Form.Item>

        <Form.Item
          name="task"
          label="Task"
          rules={[{ required: true, message: "Please enter the task" }]}
        >
          <Input.TextArea rows={4} placeholder="Task description" />
        </Form.Item>

        <Form.Item
          name="due"
          label="Due date"
          rules={[{ required: true, message: "Please select the due date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
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
            const errors = form
              .getFieldsError()
              .some((f) => f.errors && f.errors.length);

            const values = form.getFieldsValue(["name", "task", "due", "status"]);
            const filled = ["name", "task", "due", "status"].every((key) => {
              const v = values[key];
              if (v === undefined || v === null) return false;
              if (typeof v === "string" && v.trim() === "") return false;
              if (key === "due") {
                if (dayjs.isDayjs(v)) return v.isValid();
                return !!v;
              }
              return true;
            });

            const disabled = errors || !filled;

            return (
              <Space>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={disabled}
                  style={{ cursor: disabled ? "not-allowed" : "pointer" }}
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
