import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Tasks } from "./components/Tasks";

const LOCAL_STORAGE_KEY = "todo:savedTasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [rate, setRate] = useState(0.5);
  const [language, setLanguage] = useState("en-US");

  function loadSavedTasks() {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }

  useEffect(() => {
    loadSavedTasks();
  }, []);

  function setTasksAndSave(newTasks) {
    setTasks(newTasks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTasks));
  }

  function addTask(taskTitle) {
    setTasksAndSave([
      ...tasks,
      {
        id: crypto.randomUUID(),
        title: taskTitle,
        isCompleted: false,
      },
    ]);
  }

  function deleteTaskById(taskId) {
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasksAndSave(newTasks);
  }

  function toggleTaskCompletedById(taskId) {
    const newTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          isCompleted: !task.isCompleted,
        };
      }
      return task;
    });
    setTasksAndSave(newTasks);
  }

  function editTaskById(taskId, newTitle) {
    const newTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          title: newTitle,
        };
      }
      return task;
    });
    setTasksAndSave(newTasks);
  }

  const speakTask = (task) => {
    if (speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(task);
      utterance.lang = language;
      utterance.rate = rate;
      speechSynthesis.speak(utterance);
    }
  };

  const speakAllTasks = () => {
    tasks.forEach((task) => speakTask(task.title));
  };

  useEffect(() => {
    const synth = window.speechSynthesis;
    setSpeechSynthesis(synth);

    return () => {
      if (synth && synth.speaking) {
        synth.cancel();
      }
    };
  }, []);

  return (
    <>
      <Header onAddTask={addTask} />
      <div className="speech">
        <label htmlFor="rate">Speech Rate: {rate}</label>
        <input
          id="rate"
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        />
        <label htmlFor="language">Language: </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en-US">English</option>
          <option value="sv-SE">Swedish</option>
          <option value="tr-TR">Turkish</option>
        </select>
      </div>
      <Tasks
        onComplete={toggleTaskCompletedById}
        tasks={tasks}
        onDelete={deleteTaskById}
        onEdit={editTaskById}
        speakTask={speakTask}
      />
      <button onClick={speakAllTasks} className="listenAll" size={20}>
        Listen All{" "}
      </button>
    </>
  );
}

export default App;
