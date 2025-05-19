import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { taskChat } from "../features/ai/aiSlice";

const AIChat = () => {
  const dispatch = useDispatch();
  const { chatAnswer, isLoading } = useSelector((state) => state.ai);
  const [question, setQuestion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      dispatch(taskChat({ question }));
      setQuestion("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Task Q&A</h2>
      <p className="text-gray-600 mb-4">
        Ask questions about your tasks, and our AI will answer based on your
        todo list.
      </p>

      <div className="space-y-4">
        {chatAnswer && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="whitespace-pre-line">{chatAnswer}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-grow p-3 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="E.g., 'What are my highest priority tasks due today?'"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-3 rounded-r-lg hover:bg-blue-700 transition disabled:bg-blue-400"
              disabled={isLoading || !question.trim()}
            >
              {isLoading ? "Thinking..." : "Ask"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
