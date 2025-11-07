import React, { useState, useEffect } from "react";
import Input from "./Input";
import TodoList from "./TodoList";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("todos"));
    if (saved) setTodos(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddOrEdit = () => {
    if (task.trim() === "") return;

    if (isEditing) {
      const updated = todos.map((t, i) =>
        i === editIndex ? { ...t, text: task } : t
      );
      setTodos(updated);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      const newTodo = { text: task, completed: false };
      setTodos([...todos, newTodo]);
    }
    setTask("");
  };
  const handleDelete = (index) => {
    const updated = todos.filter((_, i) => i !== index);
    setTodos(updated);
  };
  const handleEdit = (index) => {
    setTask(todos[index].text);
    setIsEditing(true);
    setEditIndex(index);
  };
  const toggleComplete = (index) => {
    const updated = todos.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTodos(updated);
  };
  return (
    <div className="container">
      <Input
        task={task}
        setTask={setTask}
        handleAddOrEdit={handleAddOrEdit}
        isEditing={isEditing}
      />
      <hr />
      <TodoList
        todos={todos}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        toggleComplete={toggleComplete}
      />
    </div>
  );
}
export default App;
