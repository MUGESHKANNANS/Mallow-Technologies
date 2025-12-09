import React from "react";
import { Table, Space, Button, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import StatusTag from "./StatusTag";

export default function TaskTable({ tasks = [], loading, onEdit, onDelete }) {
  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = dayjs(value);
    return date.isValid() ? date.format("DD/MM/YYYY hh:mm A") : "-";
  };

  const columns = [
    {
      title: "Todo",
      dataIndex: "todo",
      width: "22%",
      align: "left",
      render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "20%",
      align: "center",
      render: (status) => (
        <div style={{ textAlign: "center" }}>
          <StatusTag status={status} />
        </div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: "25%",
      align: "center",
      render: (value) => <div style={{ textAlign: "center" }}>{formatDateTime(value)}</div>,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      width: "25%",
      align: "center",
      render: (value) => <div style={{ textAlign: "center" }}>{formatDateTime(value)}</div>,
    },
    {
      title: "Action",
      key: "action",
      width: "15%",
      align: "center",
      render: (_, row) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(row)}
            style={{ color: "#1677ff" }}
          />
          <Popconfirm
            title="Are you sure you want to delete?"
            onConfirm={() => onDelete(row.id)}
            okText="Yes"
            cancelText="No"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
          >
            <Button type="text" icon={<DeleteOutlined />} style={{ color: "#1677ff" }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const data = tasks.map((item) => ({ ...item, key: item.id }));

  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={false}
      loading={loading}
      tableLayout="fixed"
      style={{ width: "100%" }}
    />
  );
}
