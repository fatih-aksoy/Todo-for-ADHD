import { useState, useRef, useEffect } from "react";
import styles from "./task.module.css";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { TbTrash, TbVolume, TbEdit, TbCheck, TbX } from "react-icons/tb";

export function Task({ task, onDelete, onComplete, onEdit, speakTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const inputRef = useRef(null);

  function handleEditClick() {
    setIsEditing(true);
  }

  function handleSaveClick() {
    onEdit(task.id, newTitle);
    setIsEditing(false);
  }

  function handleCancelClick() {
    setNewTitle(task.title);
    setIsEditing(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleSaveClick();
    } else if (event.key === "Escape") {
      handleCancelClick();
    }
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className={styles.task}>
      <button
        className={styles.checkContainer}
        onClick={() => onComplete(task.id)}
      >
        {task.isCompleted ? <BsFillCheckCircleFill /> : <div />}
      </button>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.editInput}
        />
      ) : (
        <p className={task.isCompleted ? styles.textCompleted : ""}>
          {task.title}
        </p>
      )}

      {isEditing ? (
        <>
          <button onClick={handleSaveClick}>
            <TbCheck size={20} />
          </button>
          <button onClick={handleCancelClick}>
            <TbX size={20} />
          </button>
        </>
      ) : (
        <>
          <button onClick={handleEditClick}>
            <TbEdit size={20} />
          </button>
          <button>
            <TbVolume
              className={styles.listenButton}
              size={20}
              onClick={() => speakTask(task.title)}
            />
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => onDelete(task.id)}
          >
            <TbTrash size={20} />
          </button>
        </>
      )}
    </div>
  );
}
