import AISuggestions from "../components/AISuggestions";
import AIWeeklySummary from "../components/AIWeeklySummary";
import AIChat from "../components/AIChat";

const AIPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">AI Assistant</h1>

      <div className="space-y-6">
        <AISuggestions />
        <AIWeeklySummary />
        <AIChat />
      </div>
    </div>
  );
};

export default AIPage;
