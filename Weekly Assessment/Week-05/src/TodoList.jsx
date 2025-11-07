import React from "react";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";

function TodoList({ todos, handleEdit, handleDelete, toggleComplete }) {
  return (
    <ul id="todoList">
      {todos.map((todo, index) => (
        <li key={index} className={todo.completed ? "completed" : ""}>
          <div className="task">
            <input type="checkbox" checked={todo.completed} onChange={() => toggleComplete(index)} />
            <span>{todo.text}</span>
          </div>

          <div className="icons">
            <FaPenToSquare className="fa-pen-to-square" onClick={() => handleEdit(index)} />
            <FaTrash className="fa-trash" onClick={() => handleDelete(index)} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
