import React from "react";

function Input({ task, setTask, handleAddOrEdit, isEditing }) {
  return (
    <div className="input">
      <input type="text" id="todoInput"
        placeholder="Enter your task..." value={task} onChange={(e) => setTask(e.target.value)} />
      <button id="addBtn" onClick={handleAddOrEdit}>
        {isEditing ? "Edit Todo" : "Add Todo"}
      </button>
    </div>
  );
}

export default Input;
