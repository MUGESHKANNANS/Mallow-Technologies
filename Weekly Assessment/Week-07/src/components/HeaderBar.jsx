import React from "react";
import { Button } from "antd";

export default function HeaderBar({ onAdd }) {
    
  return (
    <div className="header-row">
      <h1 className="title">Task list</h1>
      <Button type="primary" onClick={onAdd}>
        Add
      </Button>
    </div>
  );
}
