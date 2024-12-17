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
} from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { MoonStars, Sun, Trash, Plus, Edit, Check } from "tabler-icons-react";

export default function TaskMaster() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskSummary, setTaskSummary] = useState("");
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
    } else {
      setEditingTask(null);
      setTaskTitle("");
      setTaskSummary("");
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
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  return (
    <MantineProvider
      theme={{
        colorScheme,
        defaultRadius: "lg",
        primaryColor: "indigo",
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

          <Stack gap="md" style={{ flex: 1, overflowY: "auto" }}>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <Card key={task.id} shadow="sm" radius="lg" withBorder>
                  <Flex justify="space-between" align="center">
                    <Stack gap="xs" style={{ flex: 1 }}>
                      <Text fw={600} size="lg">
                        {task.title}
                      </Text>
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
              ))
            ) : (
              <Text
                c="dimmed"
                ta="center"
                style={{
                  alignSelf: "center",
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              >
                No tasks yet. Let's get started!
              </Text>
            )}
          </Stack>

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

          <Modal
            opened={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingTask(null);
              setTaskTitle("");
              setTaskSummary("");
              setTitleError("");
            }}
            title={editingTask ? "Edit Task" : "Create New Task"}
            centered
            overlayProps={{
              backgroundOpacity: 0.55,
              blur: 3,
            }}
          >
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
                />
                <TextInput
                  value={taskSummary}
                  onChange={(e) => setTaskSummary(e.currentTarget.value)}
                  label="Task Summary"
                  placeholder="Optional task description"
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
