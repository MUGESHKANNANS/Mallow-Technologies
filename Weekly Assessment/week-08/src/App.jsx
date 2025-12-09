// src/App.jsx
import React, { useEffect, useState } from "react";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import HeaderBar from "./components/HeaderBar";
import TaskTable from "./components/TaskTable";
import TaskDrawer from "./components/TaskDrawer";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./features/todoSlice";

import "./App.css";

export default function App() {
  const dispatch = useDispatch();
  const { items, loading, saving, deletingId, error } = useSelector(
    (state) => state.todos
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  useEffect(() => {
    if (!error) return;
    if (typeof error === "string") {
      message.error(error);
    }
  }, [error]);

  const handleAddClick = () => {
    setCurrentTodo(null);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (row) => {
    setCurrentTodo(row);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setCurrentTodo(null);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTodo(id)).unwrap();
      message.success("Todo deleted");
    } catch (err) {
      if (typeof err === "string") {
        message.error(err);
      }
    }
  };

  const handleSave = async (values) => {
    const payload = {
      todo: values.todo.trim(),
      status: values.status,
    };

    try {
      if (currentTodo) {
        await dispatch(
          updateTodo({
            id: currentTodo.id,
            data: payload,
          })
        ).unwrap();
        message.success("Todo updated");
      } else {
        await dispatch(createTodo(payload)).unwrap();
        message.success("Todo created");
      }
      handleDrawerClose();
    } catch (err) {
      if (typeof err === "string") {
        message.error(err);
      }
    }
  };

  return (
    <div className="page-container">
      <HeaderBar onAdd={handleAddClick} />

      <div className="table-card">
        <TaskTable
          tasks={items}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      </div>

      <TaskDrawer
        open={isDrawerOpen}
        editItem={currentTodo}
        onClose={handleDrawerClose}
        onFinish={handleSave}
        submitting={saving}
      />
    </div>
  );
}
