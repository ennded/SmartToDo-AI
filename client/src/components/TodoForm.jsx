import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTodo } from "../features/todos/todoSlice";

const TodoForm = () => {
  const dispatch = useDispatch();
  const [selectedTags] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    status: "To Do",
    priority: "Medium",
    dueDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    dispatch(
      createTodo({
        ...formData,
        dueDate: formData.dueDate || undefined,
      })
    );

    setFormData({
      title: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
      tags: selectedTags.map((tag) => tag.value),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 bg-white p-4 rounded-lg shadow"
    >
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Task Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="What needs to be done?"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Priority
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Due Date (optional)
          </label>
          <input
            type="date"
            id="dueDate"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Add Task
      </button>
    </form>
  );
};

export default TodoForm;
