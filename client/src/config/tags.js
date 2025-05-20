export const TAG_OPTIONS = [
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "shopping", label: "Shopping" },
  { value: "urgent", label: "Urgent" },
];

export const getTagColor = (tag) => {
  const colors = {
    work: "bg-blue-100 text-blue-800",
    personal: "bg-green-100 text-green-800",
    shopping: "bg-purple-100 text-purple-800",
    urgent: "bg-red-100 text-red-800",
  };
  return colors[tag] || "bg-gray-100 text-gray-800";
};
