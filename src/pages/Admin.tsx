import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import {
  Shield,
  Users,
  BarChart3,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
} from "lucide-react";
import {
  getStatistics,
  getPHPMembers,
} from "../services/userService";
import { getTaskSubmissions, reviewTask } from "../services/taskService";
import {
  getEventApplications,
  reviewEventApplications,
} from "../services/eventService";
import type { User, Task, Stats } from "../types";

export const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalTasks: 0,
    totalEvents: 0,
    totalUsers: 0,
    totalPHP: 0,
    pendingTasks: 0,
    pendingEvents: 0,
    totalPointsAwarded: 0,
    pendingPHPApplications: 0,
  });
  const [phpMembers, setPHPMembers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [pointsAwarded, setPointsAwarded] = useState(0);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === "dashboard") {
        const statistics = await getStatistics();
        setStats(statistics);
      } else if (activeTab === "php-members") {
        const members = await getPHPMembers();
        setPHPMembers(members);
        setStudents(members);
      } else if (activeTab === "tasks") {
        const tasks = await getTaskSubmissions("pending");
        setPendingTasks(tasks);
      } else if (activeTab === "events") {
        const events = await getEventApplications(undefined, "pending");
        setPendingEvents(events);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleTaskReview = async (action: "approve" | "reject") => {
    if (!selectedTask) return;

    try {
      await reviewTask(
        selectedTask.id,
        action,
        feedback,
        action === "approve" ? pointsAwarded : undefined
      );
      setIsTaskModalOpen(false);
      setSelectedTask(null);
      setFeedback("");
      setPointsAwarded(0);
      loadData();
    } catch (error) {
      console.error("Error reviewing task:", error);
      alert("Failed to review task");
    }
  };

  const handleEventReview = async (
    applicationIds: number[],
    action: "approve" | "reject"
  ) => {
    try {
      await reviewEventApplications(applicationIds, action);
      loadData();
    } catch (error) {
      console.error("Error reviewing events:", error);
      alert("Failed to review event applications");
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "tasks", label: "Task Review", icon: FileText },
    { id: "events", label: "Event Applications", icon: Calendar },
    { id: "php-members", label: "PHP Members", icon: Users },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage the Peer Helpers Program
        </p>
      </div>

      {/* Tabs */}
      <Card className="mb-4">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalUsers || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    PHP Members
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalPHP || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pending Tasks
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.pendingTasks || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pending Events
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.pendingEvents || 0}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Total Points Awarded
              </h3>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {stats.totalPointsAwarded || 0}
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Pending PHP Applications
              </h3>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.pendingPHPApplications || 0}
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Task Review Tab */}
      {activeTab === "tasks" && (
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Pending Task Submissions
          </h2>
          <div className="space-y-4">
            {pendingTasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No pending task submissions
              </p>
            ) : (
              pendingTasks.map((task: any) => (
                <div
                  key={task.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {task.task_title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Submitted by: {task.first_name} {task.last_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Points: {task.task_points}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        {task.submission_text}
                      </p>
                      {task.attachments && task.attachments.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Attachments:
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                            {task.attachments.map((att: any, idx: number) => (
                              <li key={idx}>{att.file_name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedTask(task);
                        setPointsAwarded(task.task_points);
                        setIsTaskModalOpen(true);
                      }}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* Event Applications Tab */}
      {activeTab === "events" && (
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Pending Event Applications
          </h2>
          <div className="space-y-4">
            {pendingEvents.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No pending event applications
              </p>
            ) : (
              pendingEvents.map((event: any) => (
                <div
                  key={event.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {event.event_title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Applied by: {event.first_name} {event.last_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Date: {new Date(event.event_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEventReview([event.id], "approve")}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleEventReview([event.id], "reject")}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* PHP Members Tab */}
      {activeTab === "php-members" && (
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            PHP Members
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-4 text-gray-700 dark:text-gray-300">
                    Name
                  </th>
                  <th className="text-left py-2 px-4 text-gray-700 dark:text-gray-300">
                    Email
                  </th>
                  <th className="text-left py-2 px-4 text-gray-700 dark:text-gray-300">
                    Points
                  </th>
                  <th className="text-left py-2 px-4 text-gray-700 dark:text-gray-300">
                    Rank
                  </th>
                </tr>
              </thead>
              <tbody>
                {phpMembers.map((member: any) => (
                  <tr
                    key={member.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-2 px-4 text-gray-900 dark:text-white">
                      {member.first_name} {member.last_name}
                    </td>
                    <td className="py-2 px-4 text-gray-600 dark:text-gray-400">
                      {member.email}
                    </td>
                    <td className="py-2 px-4 text-gray-900 dark:text-white">
                      {member.points}
                    </td>
                    <td className="py-2 px-4 text-gray-900 dark:text-white">
                      #{member.rank}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* PHP Members Tab */}
      {activeTab === "php-members" && (
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            All PHP Members
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-4 text-gray-700 dark:text-gray-300">
                    Name
                  </th>
                  <th className="text-left py-2 px-4 text-gray-700 dark:text-gray-300">
                    Email
                  </th>
                  <th className="text-left py-2 px-4 text-gray-700 dark:text-gray-300">
                    Points
                  </th>
                  <th className="text-left py-2 px-4 text-gray-700 dark:text-gray-300">
                    Rank
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((php: any) => (
                  <tr
                    key={php.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => navigate(`/profile/${php.id}`)}
                  >
                    <td className="py-2 px-4 text-gray-900 dark:text-white">
                      {php.first_name || php.firstName} {php.last_name || php.lastName}
                    </td>
                    <td className="py-2 px-4 text-gray-600 dark:text-gray-400">
                      {php.email}
                    </td>
                    <td className="py-2 px-4 text-gray-900 dark:text-white">
                      {php.points}
                    </td>
                    <td className="py-2 px-4 text-gray-900 dark:text-white">
                      #{php.rank}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Task Review Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
          setFeedback("");
          setPointsAwarded(0);
        }}
        title="Review Task Submission"
        size="lg"
      >
        {selectedTask && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={4}
                placeholder="Enter feedback..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Points Awarded
              </label>
              <input
                type="number"
                value={pointsAwarded}
                aria-label="Points Awarded"
                onChange={(e) =>
                  setPointsAwarded(parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="primary"
                onClick={() => handleTaskReview("approve")}
                fullWidth
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={() => handleTaskReview("reject")}
                fullWidth
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
