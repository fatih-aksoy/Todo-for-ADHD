import styles from "./header.module.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useState } from "react";

export function Header({ onAddTask }) {
  const [title, setTitle] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    onAddTask(title);
    setTitle("");
  }

  function onChangeTitle(event) {
    setTitle(event.target.value);
  }

  return (
    <header className={styles.header}>
      {/* <img src={todoLogo} /> */}
      <img
        src="https://adhdgrrl.files.wordpress.com/2017/09/adhdbutterfly_conb.jpg?w=355&resize=355%2C327&h=327"
        className="logo"
        alt=""
      />

      <form onSubmit={handleSubmit} className={styles.newTaskForm}>
        <input
          placeholder="Add a new task"
          type="text"
          onChange={onChangeTitle}
          value={title}
        />
        <button>
          Create <AiOutlinePlusCircle size={20} />
        </button>
      </form>
    </header>
  );
}
