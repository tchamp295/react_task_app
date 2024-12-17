import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider} from "@mantine/core";
import App from "./App";

// Import Mantine CSS
import "@mantine/core/styles.css";

function Root() {
  return (
    <MantineProvider>
      <App />
    </MantineProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
