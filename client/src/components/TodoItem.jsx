import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTodo, deleteTodo } from "../features/todos/todoSlice";
import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const priorityColors = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-green-100 text-green-800",
};

const statusColors = {
  "To Do": "bg-gray-100 text-gray-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Done: "bg-purple-100 text-purple-800",
};

const TodoItem = ({ todo }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    status: todo.status,
    priority: todo.priority,
    dueDate: todo.dueDate
      ? new Date(todo.dueDate).toISOString().split("T")[0]
      : "",
  });

  const handleUpdate = () => {
    dispatch(
      updateTodo({
        id: todo._id,
        todoData: {
          ...editData,
          dueDate: editData.dueDate || undefined,
        },
      })
    );
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      dispatch(deleteTodo(todo._id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <div className="flex space-x-2">
            <select
              value={editData.status}
              onChange={(e) =>
                setEditData({ ...editData, status: e.target.value })
              }
              className="flex-1 p-2 border rounded"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <select
              value={editData.priority}
              onChange={(e) =>
                setEditData({ ...editData, priority: e.target.value })
              }
              className="flex-1 p-2 border rounded"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <input
            type="date"
            value={editData.dueDate}
            onChange={(e) =>
              setEditData({ ...editData, dueDate: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleUpdate}
              className="p-2 text-green-500 hover:text-green-700"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium">{todo.title}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-blue-500 hover:text-blue-700"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                statusColors[todo.status]
              }`}
            >
              {todo.status}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                priorityColors[todo.priority]
              }`}
            >
              {todo.priority}
            </span>
            {todo.dueDate && (
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                Due: {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
