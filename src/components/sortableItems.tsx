import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TodoItem from "./TodoItem";
import type { Task } from "./TodoList";

type SortableItemProps = {
  id: string;
  task: Task;
  onComplete: () => void;
  onDelete: () => void;

};

function SortableItem({ id, task, onComplete,onDelete}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TodoItem
        title={task.title}
        description={task.description}
        done={task.done}
        dragHandleProps={{ ...attributes, ...listeners }} 
        onComplete={onComplete}
        onDelete={onDelete}
      />
    </div>
  );
}

export default SortableItem;
