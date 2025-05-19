import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { suggestTasks } from "../features/ai/aiSlice";
import TodoForm from "./TodoForm";

const AISuggestions = () => {
  const dispatch = useDispatch();
  const { suggestedTasks, isLoading } = useSelector((state) => state.ai);
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch(suggestTasks(input));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">AI Task Suggestions</h2>
      <p className="text-gray-600 mb-4">
        Describe what you need to do in natural language, and our AI will
        suggest structured tasks for you.
      </p>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-3 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="E.g., 'Book flight tickets and finish presentation by Thursday'"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-3 rounded-r-lg hover:bg-blue-700 transition disabled:bg-blue-400"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? "Processing..." : "Suggest Tasks"}
          </button>
        </div>
      </form>

      {suggestedTasks.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Suggested Tasks:</h3>
          <div className="space-y-4">
            {suggestedTasks.map((task, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <TodoForm
                  initialData={{
                    title: task.title,
                    status: task.status || "To Do",
                    priority: task.priority || "Medium",
                    dueDate: task.dueDate || "",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AISuggestions;
