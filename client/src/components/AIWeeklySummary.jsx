import { useDispatch, useSelector } from "react-redux";
import { getWeeklySummary } from "../features/ai/aiSlice";
import { useEffect } from "react";

const AIWeeklySummary = () => {
  const dispatch = useDispatch();
  const { weeklySummary, isLoading } = useSelector((state) => state.ai);

  useEffect(() => {
    dispatch(getWeeklySummary());
  }, [dispatch]);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Weekly Summary</h2>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      ) : (
        <div className="prose max-w-none">
          {weeklySummary ? (
            <p className="whitespace-pre-line">{weeklySummary}</p>
          ) : (
            <p className="text-gray-500">No completed tasks this week.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AIWeeklySummary;
