import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleNavigation = (path) => {
    if (location.pathname === path) {
      // Force a reload if already on the target path
      navigate(path);
      window.location.reload();
    } else {
      navigate(path);
    }
  };

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
              <button
                onClick={() => handleNavigation("/todos")}
                className="hover:underline"
              >
                My Todos
              </button>
              <button
                onClick={() => handleNavigation("/ai")}
                className="hover:underline"
              >
                AI Assistant
              </button>
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
