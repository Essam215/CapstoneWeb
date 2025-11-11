import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from "../components/Table";
import { Modal } from "../components/Modal";
import { Filter, Search, Upload, File } from "lucide-react";
import { getTasks, getTaskById, submitTask } from "../services/taskService";
import { useAuth } from "../context/AuthContext";
import type { Task } from "../types";

export const MyTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    try {
      const status = filter === "all" ? undefined : filter;
      const tasksData = await getTasks(status);
      // Filter to show only tasks assigned to current user or created by current user
      const myTasks = tasksData.filter(
        (task) => task.assignedTo === user?.id || task.createdBy === user?.id
      );
      setTasks(myTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const handleSubmitTask = async () => {
    if (!selectedTask || !submissionText.trim()) {
      alert("Please enter submission text");
      return;
    }

    setLoading(true);
    try {
      await submitTask(Number(selectedTask.id), submissionText, selectedFiles);
      alert("Task submitted successfully!");
      setIsModalOpen(false);
      setSelectedTask(null);
      setSubmissionText("");
      setSelectedFiles([]);
      loadTasks();
    } catch (error) {
      console.error("Error submitting task:", error);
      alert("Failed to submit task");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter((file) => {
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`);
          return false;
        }
        return true;
      });
      setSelectedFiles([...selectedFiles, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === "all" || task.status === filter;
    const matchesSearch =
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleTaskClick = async (task: Task) => {
    try {
      const taskData = await getTaskById(task.id);
      setSelectedTask(taskData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error loading task:", error);
      setSelectedTask(task);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1E3A8A] dark:text-white mb-1 font-sans tracking-tight">
          My Tasks
        </h1>
        <div className="h-1 w-20 bg-[#1E3A8A] rounded-full mt-2"></div>
        <p className="text-gray-600 dark:text-gray-400 font-sans mt-4">
          View and manage your assigned tasks
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent bg-white dark:bg-gray-800 text-[#1F2937] dark:text-white font-sans"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent bg-white dark:bg-gray-800 text-[#1F2937] dark:text-white font-sans"
              aria-label="Filter tasks by status"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tasks Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableHeaderCell>Title</TableHeaderCell>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell>Points</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Due Date</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                >
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task, index) => (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <TableRow onClick={() => handleTaskClick(task)}>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {task.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {task.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-sm">
                        {task.category_name || task.category}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900 dark:text-white">
                      {task.points}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          task.status === "completed"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : task.status === "in-progress"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : task.status === "approved"
                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {task.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {task.due_date || task.dueDate
                        ? new Date(task.due_date || task.dueDate || "").toLocaleDateString()
                        : "No due date"}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskClick(task);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Task Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
          setSubmissionText("");
          setSelectedFiles([]);
        }}
        title={selectedTask ? selectedTask.title : "Task Details"}
        size="lg"
      >
        {selectedTask && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Description
              </h3>
              <p className="text-gray-900 dark:text-white">
                {selectedTask.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Category
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedTask.category_name || selectedTask.category}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Points
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedTask.points}
                </p>
              </div>
            </div>
            {(selectedTask.due_date || selectedTask.dueDate) && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Due Date
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {new Date(selectedTask.due_date || selectedTask.dueDate || "").toLocaleDateString()}
                </p>
              </div>
            )}
            {selectedTask.status !== "completed" && selectedTask.status !== "approved" && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Submission Text
                  </label>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-sans"
                    rows={4}
                    placeholder="Enter your submission..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attachments
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button variant="outline" size="sm" as="span">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Files
                      </Button>
                    </label>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <File className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {file.name}
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleSubmitTask}
                  disabled={loading || !submissionText.trim()}
                  fullWidth
                >
                  {loading ? "Submitting..." : "Submit Task"}
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

