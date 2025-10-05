import { useState,useEffect, type ChangeEvent } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./sortableItems";

export type Task = {
  id: string;
  title: string;
  description: string;
  done: boolean;
};

function TodoList() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [toShow, setToshow] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const r = localStorage.getItem("tasks");
    return r? JSON.parse(r): [];
  });
  useEffect(() => {
    localStorage.setItem("tasks",JSON.stringify(tasks))
  })
  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }
  function handleDescriptionChange(e: ChangeEvent<HTMLInputElement>) {
    setDescription(e.target.value);
  }

  function addTask() {
    if (!title.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      done: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setTitle("");
    setDescription("");
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTasks((tasks) => {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      return arrayMove(tasks, oldIndex, newIndex);
    });
  }

  function handleComplete(id: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function handleDelete(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  return (
    <div className="to-do-list bg-[#343434] w-[300px] sm:w-[600px] md:w-[750px] lg:w-[800px] rounded-2xl min-h-150 block shadow-[15px_15px_30px] p-3 border-8 ">
      <div className="to-do-list-header flex sm:flex-row flex-col w-full ">
        <div className="m-auto mt-4">
          <h2 className=" text-white text-xl mb-2">Title:</h2>
          <input
            type="text"
            className="bg-white text-blue-950 rounded-md w-60 h-8 hover:bg-gray-300 focus:outline-none shadow-sm shadow-gray-300"
            value={title}
            onChange={handleTitleChange}
            placeholder="Walk the dog"
            maxLength={40}
          />
        </div>
        <div className="m-auto mt-4">
          <h2 className=" text-white text-xl mb-2">Description:</h2>
          <input
            type="text"
            className="bg-white text-blue-950 rounded-md w-60 h-8 hover:bg-gray-300 focus:outline-none shadow-sm shadow-gray-300"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Walk the dog at 3:00 PM"
          />
        </div>
      </div>
      <div className="mb-3 mt-4 flex justify-center">
        <button
          className=" w-23 h-10 sm:w-30 bg-green-800 rounded-xl text-white hover:bg-green-500  "
          onClick={addTask}
        >
          Add
        </button>
      </div>
      <div className="line w-3/4 border-b-5 border-[#1a1a1d] m-auto"></div>
      <div className="to-do-list-body w-full">
        <div className="mt-3 ml-4">
          <button
            onClick={() => setToshow(false)}
            className={`${
              toShow === false
                ? "bg-[#0e7044] hover:bg-[#073d25]"
                : "bg-gray-600 hover:bg-gray-800"
            } text-white w-15 rounded-l-md `}
          >
            To Do
          </button>
          <button
            onClick={() => setToshow(true)}
            className={`${
              toShow === true
                ? "bg-[#0e7044] hover:bg-[#073d25]"
                : "bg-gray-600 hover:bg-gray-800"
            } text-white w-19 rounded-r-md `}
          >
            Finished
          </button>
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="to-do-list-items-list mt-4">
              {tasks.filter((task) => (toShow ? task.done : !task.done)).length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                {toShow ? "No completed tasks yet " : "No pending tasks "}
              </p>
              ) : (tasks.filter((task) => (toShow ? task.done : !task.done)).map((task) => (
                <SortableItem
                key={task.id}
                id={task.id}
                task={task}
                onComplete={() => handleComplete(task.id)}
                onDelete={() => handleDelete(task.id)}
              />
              ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

export default TodoList;
