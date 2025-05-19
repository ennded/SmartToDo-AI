import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Welcome to SmartToDo AI
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Manage your tasks efficiently with AI-powered suggestions, summaries,
        and insights.
      </p>

      {user ? (
        <div className="space-x-4">
          <Link
            to="/todos"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Go to My Todos
          </Link>
          <Link
            to="/ai"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-purple-700 transition"
          >
            Try AI Features
          </Link>
        </div>
      ) : (
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-gray-800 text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-900 transition"
          >
            Register
          </Link>
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">AI Task Suggestions</h3>
          <p className="text-gray-600">
            Describe your tasks in natural language and let our AI convert them
            into structured todos.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Weekly Summaries</h3>
          <p className="text-gray-600">
            Get insightful summaries of your completed tasks to track your
            productivity.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Task Q&A</h3>
          <p className="text-gray-600">
            Ask questions about your tasks and get intelligent answers based on
            your todo list.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
