import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          SmartToDo AI
        </Link>

        <nav className="flex items-center space-x-6">
          {user ? (
            <>
              <Link to="/todos" className="hover:underline">
                My Todos
              </Link>
              <Link to="/ai" className="hover:underline">
                AI Assistant
              </Link>
              <button
                onClick={onLogout}
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
