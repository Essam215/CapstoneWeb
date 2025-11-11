import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { createTask } from "../services/taskService";

export const AddTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    points: "",
    dueDate: "",
  });

  const categories = [
    "Tutoring",
    "Mentoring",
    "Organization",
    "Workshop",
    "Service",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.points) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await createTask({
        title: formData.title,
        description: formData.description,
        categoryId: categories.indexOf(formData.category) + 1,
        points: parseInt(formData.points),
        dueDate: formData.dueDate || undefined,
      });
      alert("Task created successfully!");
      navigate("/tasks");
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1E3A8A] dark:text-white mb-1 font-sans tracking-tight">
          Add New Task
        </h1>
        <div className="h-1 w-20 bg-[#1E3A8A] rounded-full mt-2"></div>
        <p className="text-gray-600 dark:text-gray-400 font-sans mt-4">
          Create a new task for PHP members
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-sans"
            >
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent bg-white dark:bg-gray-800 text-[#1F2937] dark:text-white font-sans"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-sans"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent bg-white dark:bg-gray-800 text-[#1F2937] dark:text-white font-sans"
              placeholder="Enter task description"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-sans"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent bg-white dark:bg-gray-800 text-[#1F2937] dark:text-white font-sans"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="points"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-sans"
              >
                Points <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="points"
                name="points"
                value={formData.points}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent bg-white dark:bg-gray-800 text-[#1F2937] dark:text-white font-sans"
                placeholder="Enter points"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-sans"
            >
              Due Date (Optional)
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent bg-white dark:bg-gray-800 text-[#1F2937] dark:text-white font-sans"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/tasks")}
              fullWidth
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} fullWidth>
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

