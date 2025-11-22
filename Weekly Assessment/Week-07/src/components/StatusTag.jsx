import React from "react";
import { Tag } from "antd";

export default function StatusTag({ status }) {
    
  if (!status) return <Tag>-</Tag>;

  const text = status.trim().toLowerCase();

  const styles = { fontWeight: 600 };

  if (text === "completed") {
    return (
      <Tag color="#3a9e13" style={{ ...styles, border: "1px solid #3a9e13" }}>
        COMPLETED
      </Tag>
    );
  }

  if (text === "not started" || text === "started") {
    return (
      <Tag color="#d6461e" style={{ ...styles, border: "1px solid #d6461e" }}>
        NOT STARTED
      </Tag>
    );
  }

  if (text === "in-progress" || text === "in progress") {
    return (
      <Tag color="#2641c7" style={{ ...styles, border: "1px solid #2641c7" }}>
        IN-PROGRESS
      </Tag>
    );
  }

  return <Tag style={styles}>{status}</Tag>;
}
