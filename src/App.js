import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
  Stack,
  Box,
  Tooltip,
  Paper,
  useMantineTheme,
  MantineProvider,
} from "@mantine/core";
import {
  MoonStars,
  Sun,
  Trash,
  Edit,
  ListDetails,
  CirclePlus,
} from "tabler-icons-react";
import { useColorScheme, useLocalStorage, useHotkeys } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

export default function EnhancedTaskApp() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const theme = useMantineTheme();
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: preferredColorScheme || "light",
    getInitialValueInEffect: true,
  });

  const taskTitle = useRef(null);
  const taskSummary = useRef(null);

  const toggleColorScheme = () =>
    setColorScheme(colorScheme === "dark" ? "light" : "dark");

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  function createOrUpdateTask() {
    const title = taskTitle.current?.value.trim();
    const summary = taskSummary.current?.value.trim();

    if (!title) {
      notifications.show({
        title: "Error",
        message: "Task title cannot be empty",
        color: "red",
      });
      return;
    }

    if (editingTask !== null) {
      const updatedTasks = tasks.map((task, index) =>
        index === editingTask ? { title, summary } : task
      );
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      notifications.show({
        title: "Task Updated",
        message: `Task "${title}" has been updated`,
        color: "green",
      });
    } else {
      const newTasks = [...tasks, { title, summary, createdAt: new Date() }];
      setTasks(newTasks);
      saveTasks(newTasks);
      notifications.show({
        title: "Task Created",
        message: `New task "${title}" added`,
        color: "blue",
      });
    }

    setOpened(false);
    setEditingTask(null);
    if (taskTitle.current) taskTitle.current.value = "";
    if (taskSummary.current) taskSummary.current.value = "";
  }

  function deleteTask(index) {
    const taskToDelete = tasks[index];
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    notifications.show({
      title: "Task Deleted",
      message: `Task "${taskToDelete.title}" has been removed`,
      color: "red",
    });
  }

  function editTask(index) {
    setEditingTask(index);
    const task = tasks[index];

    if (taskTitle.current) taskTitle.current.value = task.title;
    if (taskSummary.current) taskSummary.current.value = task.summary || "";

    setOpened(true);
  }

  function loadTasks() {
    const loadedTasks = localStorage.getItem("tasks");
    const parsedTasks = JSON.parse(loadedTasks || "[]");
    setTasks(parsedTasks);
  }

  function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <MantineProvider
      theme={{ colorScheme, defaultRadius: "md", primaryColor: "indigo" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Container
        size="sm"
        py="xl"
        sx={{
          background:
            colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          minHeight: "100vh",
        }}
      >
        <Paper shadow="md" p="lg" radius="md">
          <Group position="apart" align="center" mb="xl">
            <Title
              order={1}
              sx={(theme) => ({
                fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                fontWeight: 900,
                backgroundImage: theme.fn.linearGradient(
                  45,
                  theme.colors.indigo[6],
                  theme.colors.cyan[6]
                ),
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              })}
            >
              <ListDetails style={{ marginRight: "10px" }} /> Task Manager
            </Title>
            <Tooltip
              label={`Switch to ${
                colorScheme === "dark" ? "Light" : "Dark"
              } Mode`}
            >
              <ActionIcon
                variant="outline"
                color={colorScheme === "dark" ? "yellow" : "blue"}
                onClick={() => toggleColorScheme()}
              >
                {colorScheme === "dark" ? (
                  <Sun size={20} />
                ) : (
                  <MoonStars size={20} />
                )}
              </ActionIcon>
            </Tooltip>
          </Group>

          <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title={
              <Title order={3}>
                {editingTask !== null ? "Edit Task" : "Create New Task"}
              </Title>
            }
            centered
          >
            <Stack spacing="md">
              <TextInput
                ref={taskTitle}
                label="Task Title"
                placeholder="Enter task title"
                required
              />
              <TextInput
                ref={taskSummary}
                label="Task Description"
                placeholder="Optional task description"
              />
              <Group position="right">
                <Button color="gray" onClick={() => setOpened(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={createOrUpdateTask}
                  leftIcon={<CirclePlus size={16} />}
                >
                  {editingTask !== null ? "Update Task" : "Create Task"}
                </Button>
              </Group>
            </Stack>
          </Modal>

          {tasks.length === 0 ? (
            <Box style={{ textAlign: "center" }}>
              <Text color="dimmed">
                No tasks yet. Click "New Task" to get started!
              </Text>
            </Box>
          ) : (
            <Stack>
              {tasks.map((task, index) => (
                <Card key={index} withBorder>
                  <Group position="apart">
                    <Stack spacing={0}>
                      <Text weight={600}>{task.title}</Text>
                      <Text color="dimmed" size="sm">
                        {task.summary || "No description"}
                      </Text>
                    </Stack>
                    <Group>
                      <ActionIcon color="blue" onClick={() => editTask(index)}>
                        <Edit size={16} />
                      </ActionIcon>
                      <ActionIcon color="red" onClick={() => deleteTask(index)}>
                        <Trash size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))}
            </Stack>
          )}

          <Button fullWidth mt="md" onClick={() => setOpened(true)}>
            <CirclePlus size={16} /> New Task
          </Button>
        </Paper>
      </Container>
    </MantineProvider>
  );
}
