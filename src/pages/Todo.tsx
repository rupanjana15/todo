import React, { useState, useEffect } from "react";
import { useAuth } from "../context/auth";

type Todo = { id: string; text: string; done: boolean };

const TODOS_KEY = "todo_demo_tasks";

const Todos: React.FC = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const raw = localStorage.getItem(TODOS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [text, setText] = useState("");

  useEffect(() => {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
  }, [todos]);

  const add = () => {
    if (!text.trim()) return;
    const id = Math.random().toString(36).slice(2, 9);
    setTodos((s) => [{ id, text: text.trim(), done: false }, ...s]);
    setText("");
  };

  const toggle = (id: string) => setTodos((s) => s.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: string) => setTodos((s) => s.filter((t) => t.id !== id));

  return (
    <div>
      <h2>{user?.name}'s Todos</h2>
      <div className="todo-input">
        <input placeholder="Add todo" value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={add} className="btn">Add</button>
      </div>

      <ul className="todo-list">
        {todos.length === 0 && <li>No todos yet — add one!</li>}
        {todos.map((t) => (
          <li key={t.id} className={t.done ? "done" : ""}>
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            <span>{t.text}</span>
            <button onClick={() => remove(t.id)} className="small-btn">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
