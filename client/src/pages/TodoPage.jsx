import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTodos } from "../features/todos/todoSlice";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";
import { DotSpinner } from "@uiball/loaders";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { reorderTodos } from "../features/todos/todoSlice";

const TodoPage = () => {
  const dispatch = useDispatch();
  const { todos, isLoading } = useSelector((state) => state.todos);

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  const handleDragEnd = (result) => {
    console.log("Source:", result.source);
    console.log("Destination:", result.destination);

    if (!result.destination) return;

    if (result.destination.index === result.source.index) return;

    dispatch(
      reorderTodos({
        startIndex: result.source.index,
        endIndex: result.destination.index,
      })
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TodoForm />

          {isLoading ? (
            <div className="flex justify-center">
              <DotSpinner color="#3b82f6" height={50} width={50} />
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No tasks yet. Add one above!</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="todos">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {todos.map((todo, index) => (
                      <Draggable
                        key={todo._id}
                        draggableId={todo._id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <TodoItem
                            todo={todo}
                            innerRef={provided.innerRef}
                            draggableProps={provided.draggableProps}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>

        <div>
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-3">Task Statistics</h2>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-2xl font-bold">{todos.length}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="text-2xl font-bold">
                  {todos.filter((t) => t.status === "Done").length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <p className="text-2xl font-bold">
                  {todos.filter((t) => t.priority === "High").length}
                </p>
                <p className="text-sm text-gray-600">High Priority</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Quick Filters</h2>
            <div className="space-y-2">
              <button
                onClick={() => dispatch(getTodos())}
                className="w-full text-left p-2 hover:bg-gray-50 rounded"
              >
                All Tasks
              </button>
              <button
                onClick={() => dispatch(getTodos({ status: "To Do" }))}
                className="w-full text-left p-2 hover:bg-gray-50 rounded"
              >
                To Do
              </button>
              <button
                onClick={() => dispatch(getTodos({ status: "In Progress" }))}
                className="w-full text-left p-2 hover:bg-gray-50 rounded"
              >
                In Progress
              </button>
              <button
                onClick={() => dispatch(getTodos({ status: "Done" }))}
                className="w-full text-left p-2 hover:bg-gray-50 rounded"
              >
                Completed
              </button>
              <button
                onClick={() => dispatch(getTodos({ priority: "High" }))}
                className="w-full text-left p-2 hover:bg-gray-50 rounded"
              >
                High Priority
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoPage;
