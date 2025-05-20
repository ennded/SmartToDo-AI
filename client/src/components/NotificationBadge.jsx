import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const NotificationBadge = () => {
  const { todos } = useSelector((state) => state.todos);

  useEffect(() => {
    if (!todos) return;

    const overdue = todos.filter(
      (todo) =>
        todo.dueDate &&
        new Date(todo.dueDate) < new Date() &&
        todo.status !== "Done"
    );

    const dueToday = todos.filter((todo) => {
      if (!todo.dueDate || todo.status === "Done") return false;
      const today = new Date();
      const dueDate = new Date(todo.dueDate);
      return (
        dueDate.getDate() === today.getDate() &&
        dueDate.getMonth() === today.getMonth() &&
        dueDate.getFullYear() === today.getFullYear()
      );
    });

    if (overdue.length > 0) {
      toast.warning(`You have ${overdue.length} overdue tasks!`, {
        autoClose: false,
        toastId: "overdue-notification",
      });
    }

    if (dueToday.length > 0) {
      toast.info(`You have ${dueToday.length} tasks due today`, {
        autoClose: false,
        toastId: "due-today-notification",
      });
    }

    return () => {
      toast.dismiss("overdue-notification");
      toast.dismiss("due-today-notification");
    };
  }, [todos]);

  return null;
};

export default NotificationBadge;
