import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MantineProvider } from "@mantine/core";

function Root() {
  const [colorScheme, setColorScheme] = useState("light");

  // Function to toggle between light and dark modes
  const toggleColorScheme = () =>
    setColorScheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
