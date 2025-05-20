import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import TodoList from "./TodoList";

const mockStore = configureStore([]);

describe("TodoList", () => {
  test("Displays todos correctly", () => {
    const store = mockStore({
      todos: {
        todos: [
          { _id: "1", title: "Test Todo 1", status: "To Do" },
          { _id: "2", title: "Test Todo 2", status: "Done" },
        ],
      },
    });

    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );

    expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
  });
});
