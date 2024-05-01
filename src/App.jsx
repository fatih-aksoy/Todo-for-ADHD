import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Tasks } from "./components/Tasks";

const LOCAL_STORAGE_KEY = "todo:savedTasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [speechSynthesis, setSpeechSynthesis] = useState(null); //! speech

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
  //! speech
  const speakTask = (task) => {
    if (speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(task);
      speechSynthesis.speak(utterance);
    }
  };
  //! listen all button
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
      <Tasks
        onComplete={toggleTaskCompletedById}
        tasks={tasks}
        onDelete={deleteTaskById}
        speakTask={speakTask}
      />
      {/* //! Listen All button */}
      <button
        onClick={speakAllTasks}
        className="listenAll"
        size={20}
      >
        Listen All{" "}
      </button>
    </>
  );
}

export default App;
// ! install "yarn"
// ! to start app "yarn run dev" veya "yarn dev"
// ! https://github.com/GBDev13
// ! https://vitejs.dev/guide/  burdan basladik  npm create vite@latest. kurumlardan sonra yarn dev ile actik
// ! yarn add react-icons
// ! tum css lerden sonra artik state lere geceriz.
// !  {...tasks}, seklinde yazsak diger tasklar kaybolur oyuzden  ...tasks, boyle yazariz ve diger tasklri tutariz.
