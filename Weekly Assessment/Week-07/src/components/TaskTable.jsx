import React from "react";
import { Table, Space, Button, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import StatusTag from "./StatusTag";

export default function TaskTable({ tasks = [], onEdit, onDelete }) {
  const formatDate = (value) => {
    if (!value) return "-";
    const d = dayjs.isDayjs(value) ? value : dayjs(value);
    return d.isValid() ? d.format("DD/MM/YYYY") : "-";
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: 150,
      render: (text) => <div className="wrap-text">{text}</div>,
    },
    {
      title: "Task",
      dataIndex: "task",
      width: 400,
      render: (text) => (
        <div className="wrap-text" style={{ color: "#333" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Due date",
      dataIndex: "due",
      width: 140,
      render: (d) => formatDate(d),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 160,
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 120,
      render: (_, row) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(row)}
            style={{ color: "#2491ff" }}
          />

          <Popconfirm
            title="Are you sure you want to delete this task?"
            onConfirm={() => onDelete(row.id)}
            okText="Yes"
            cancelText="No"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              style={{ color: "#2491ff" }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const data = tasks.map((t) => ({ ...t, key: t.id }));

  return (
    
    <Table
      dataSource={data}
      columns={columns}
      pagination={false}
      style={{ width: "100%" }}
      rowClassName={() => "task-row"}
    />
  );
}
