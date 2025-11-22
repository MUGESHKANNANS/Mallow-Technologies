import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { message } from "antd";
import HeaderBar from "./components/HeaderBar";
import TaskTable from "./components/TaskTable";
import TaskDrawer from "./components/TaskDrawer";
import "./App.css";

const STORAGE_KEY = "task_list";

function loadTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const list = JSON.parse(data);
    return list.map(item => ({
      ...item,
      due: item.due ? dayjs(item.due) : null
    }));
  } catch (err) {
    console.log("Storage read error:", err);
    return [];
  }
}

function saveTasks(list) {
  try {
    const clean = list.map(t => ({
      ...t,
      due: t.due ? t.due.toISOString() : null
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  } catch (err) {
    console.log("Storage save error:", err);
  }
}

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const old = loadTasks();
    if (old.length > 0) return old;
    return [
      {
        id: 1,
        name: "John",
        task: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        due: dayjs("2022-07-30"),
        status: "Completed",
      },
      {
        id: 2,
        name: "Jim",
        task: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        due: dayjs("2022-07-30"),
        status: "Not Started",
      },
      {
        id: 3,
        name: "Joe",
        task: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        due: dayjs("2022-07-30"),
        status: "In-Progress",
      },
    ];
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = () => {
    setEditItem(null);
    setDrawerOpen(true);
  };

  const editTask = (row) => {
    setEditItem(row);
    setDrawerOpen(true);
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    message.success("Deleted");
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditItem(null);
  };

  const saveTask = (values) => {
    const data = {
      id: editItem ? editItem.id : Date.now(),
      name: values.name,
      task: values.task,
      due: values.due || null,
      status: values.status
    };

    if (editItem) {
      setTasks(prev => prev.map(t => (t.id === editItem.id ? data : t)));
      message.success("Updated");
    } else {
      setTasks(prev => [data, ...prev]);
      message.success("Added");
    }

    closeDrawer();
  };

  return (
    <div className="page-container">
      <HeaderBar onAdd={ addTask } />

      <div className="table-card">
        <TaskTable tasks={ tasks } onEdit={ editTask } onDelete={ deleteTask } />
      </div>

      <TaskDrawer
        open={ drawerOpen }
        editItem={ editItem }
        onClose={ closeDrawer }
        onFinish={ saveTask }
        ref={ formRef }
      />
    </div>
  );
}