import React, { useState, useCallback, useEffect } from "react";
import {
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
  useMantineColorScheme,
  Flex,
  Stack,
  MantineProvider,
  Button,
  Tooltip,
  Select,
  Badge,
  ScrollArea,
} from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import {
  MoonStars,
  Sun,
  Trash,
  Plus,
  Edit,
  Check,
  CircleCheck,
  AlertCircle,
} from "tabler-icons-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskMaster() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskSummary, setTaskSummary] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [titleError, setTitleError] = useState("");

  useHotkeys([
    ["mod+J", () => toggleColorScheme()],
    ["mod+N", () => openModal()],
  ]);

  const loadTasks = useCallback(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const saveTasks = useCallback((updatedTasks) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskTitle(task.title);
      setTaskSummary(task.summary || "");
      setTaskPriority(task.priority || "medium");
    } else {
      setEditingTask(null);
      setTaskTitle("");
      setTaskSummary("");
      setTaskPriority("medium");
    }
    setTitleError("");
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate title
    if (!taskTitle.trim()) {
      setTitleError("Task title is required");
      return;
    }

    const newTask = {
      id: editingTask?.id || Date.now(),
      title: taskTitle,
      summary: taskSummary,
      priority: taskPriority,
      createdAt: editingTask?.createdAt || new Date().toLocaleString(),
    };

    const updatedTasks = editingTask
      ? tasks.map((task) => (task.id === editingTask.id ? newTask : task))
      : [...tasks, newTask];

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setIsModalOpen(false);

    // Reset form
    setTaskTitle("");
    setTaskSummary("");
    setTaskPriority("medium");
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <MantineProvider
      theme={{
        colorScheme,
        defaultRadius: "lg",
        primaryColor: "indigo",
        fontFamily: "Inter, sans-serif",
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Container size="sm" py={20}>
        <Flex
          direction="column"
          gap="md"
          style={{
            height: "calc(100vh - 40px)",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <Flex justify="space-between" align="center">
            <Title
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan", deg: 45 }}
              order={1}
              style={{ fontWeight: 900 }}
            >
              Task Master
            </Title>
            <Tooltip
              label={`Switch to ${
                colorScheme === "dark" ? "light" : "dark"
              } mode`}
            >
              <ActionIcon
                variant="outline"
                color={colorScheme === "dark" ? "yellow" : "blue"}
                onClick={toggleColorScheme}
                size="lg"
                radius="xl"
              >
                {colorScheme === "dark" ? (
                  <Sun size={20} />
                ) : (
                  <MoonStars size={20} />
                )}
              </ActionIcon>
            </Tooltip>
          </Flex>

          <ScrollArea style={{ flex: 1 }}>
            <Stack gap="md">
              <AnimatePresence>
                {tasks.length === 0 ? (
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    style={{
                      height: "300px",
                      textAlign: "center",
                      opacity: 0.7,
                    }}
                  >
                    <AlertCircle
                      size={80}
                      color="gray"
                      style={{ marginBottom: "20px" }}
                    />
                    <Text size="xl" weight={600} color="dimmed" mb="md">
                      Your task list is empty
                    </Text>
                    <Text color="dimmed" mb="lg">
                      Start by adding your first task and boost your
                      productivity!
                    </Text>
                  </Flex>
                ) : (
                  tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        shadow="sm"
                        radius="lg"
                        withBorder
                        style={{
                          transition: "transform 0.2s",
                          "&:hover": { transform: "scale(1.02)" },
                        }}
                      >
                        <Flex justify="space-between" align="center">
                          <Stack gap="xs" style={{ flex: 1 }}>
                            <Flex align="center" gap="xs">
                              <Text fw={600} size="lg">
                                {task.title}
                              </Text>
                              <Badge
                                color={getPriorityColor(task.priority)}
                                variant="light"
                                size="sm"
                              >
                                {task.priority?.charAt(0).toUpperCase() +
                                  task.priority?.slice(1) || "Unknown"}
                              </Badge>
                            </Flex>
                            {task.summary && (
                              <Text c="dimmed" size="sm">
                                {task.summary}
                              </Text>
                            )}
                            <Text c="gray.6" size="xs">
                              Created: {task.createdAt}
                            </Text>
                          </Stack>
                          <Group>
                            <Tooltip label="Edit Task">
                              <ActionIcon
                                variant="light"
                                color="blue"
                                onClick={() => openModal(task)}
                                size="lg"
                                radius="md"
                              >
                                <Edit size={20} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Delete Task">
                              <ActionIcon
                                variant="light"
                                color="red"
                                onClick={() => deleteTask(task.id)}
                                size="lg"
                                radius="md"
                              >
                                <Trash size={20} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Flex>
                      </Card>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </Stack>
          </ScrollArea>

          <Button
            fullWidth
            size="md"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            leftIcon={<Plus />}
            onClick={() => openModal()}
          >
            Add New Task
          </Button>

          {/* Rest of the code remains the same */}
          <Modal
            opened={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingTask(null);
              setTaskTitle("");
              setTaskSummary("");
              setTaskPriority("medium");
              setTitleError("");
            }}
            title={editingTask ? "Edit Task" : "Create New Task"}
            centered
            overlayProps={{
              backgroundOpacity: 0.55,
              blur: 3,
            }}
          >
            {/* Modal content remains the same */}
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  value={taskTitle}
                  onChange={(e) => {
                    setTaskTitle(e.currentTarget.value);
                    setTitleError("");
                  }}
                  label="Task Title"
                  placeholder="Enter task title"
                  required
                  radius="md"
                  error={titleError}
                  icon={<CircleCheck size={18} />}
                />
                <TextInput
                  value={taskSummary}
                  onChange={(e) => setTaskSummary(e.currentTarget.value)}
                  label="Task Summary"
                  placeholder="Optional task description"
                  radius="md"
                />
                <Select
                  label="Priority"
                  placeholder="Select task priority"
                  data={[
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                  ]}
                  value={taskPriority}
                  onChange={(value) => setTaskPriority(value || "medium")}
                  radius="md"
                />
                <Group position="right" mt="md">
                  <Button
                    variant="light"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingTask(null);
                      setTaskTitle("");
                      setTaskSummary("");
                      setTaskPriority("medium");
                      setTitleError("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" leftIcon={<Check size={18} />}>
                    {editingTask ? "Update Task" : "Create Task"}
                  </Button>
                </Group>
              </Stack>
            </form>
          </Modal>
        </Flex>
      </Container>
    </MantineProvider>
  );
}
