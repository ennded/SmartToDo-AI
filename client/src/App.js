import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TodoPage from "./pages/TodoPage";
import AIPage from "./pages/AIPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();

  useEffect(() => {}, [location]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="todos" element={<TodoPage key={location.pathname} />} />
          <Route path="ai" element={<AIPage key={location.pathname} />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
