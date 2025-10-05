import { useState, useEffect } from "react";

type TodoItemProps = {
  title: string;
  description: string;
  done: boolean;
  onDelete: () => void;
  onComplete: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>; 
};

function TodoItem({
  title,
  description,
  done,
  onDelete,
  onComplete,
  dragHandleProps,
}: TodoItemProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isHover, setIsHover] = useState<boolean>(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 640);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

 
  const formatTitle = (text: string) =>
    text.match(/.{1,12}/g)?.join("\n") || text;

  let textToShow = description;
  let titleToShow = title;
  if (isMobile) {
    if (!expanded) {
      titleToShow = formatTitle(title);
      textToShow =
        description.length > 40 ? description.slice(0, 40) + "..." : description;
    } else {
      titleToShow = formatTitle(title);
      textToShow = description;
    }
  }

  return (
    <div
      className="w-full bg-[#454545] text-white rounded-lg p-4 mb-3 flex flex-col shadow-md transition-all duration-200"
      onMouseEnter={() => !isMobile && setIsHover(true)}
      onMouseLeave={() => !isMobile && setIsHover(false)}
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
        <div className="flex flex-row items-center gap-2">
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01"
              />
            </svg>
          </div>

          

          <h3 className="text-lg font-semibold break-words mb-0 md:mb-0">
            {titleToShow}
          </h3>
        </div>

        {(isMobile || isHover) && (
          <div className="flex md:flex-row flex-wrap justify-center gap-2">
            <button
              onClick={onComplete}
              className="text-green-400 px-2 py-1 rounded hover:bg-green-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={done ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75l2.25 2.25L15 9.75m-3-6.75a9 9 0 110 18 9 9 0 010-18z"
                />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="text-red-400 px-2 py-1 rounded hover:bg-red-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-200 text-sm whitespace-pre-line break-words">
        {textToShow}
      </p>

      {isMobile && description.length > 40 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-blue-400 hover:underline text-xs"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

export default TodoItem;
