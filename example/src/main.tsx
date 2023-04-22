import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { clickE2e } from "./click-e2e";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const isWebDev = true;

if (isWebDev) {
  import("@amarkdown/testing-candy").then(
    ({ testingOptions, createTesting }) => {
      createTesting({
        onError: (err: Error, key: string) => {
          alert(err);
        },
        onSuccess: (key) => {
          alert(key);
        },
        tests: {
          click: [{ name: "click", test: clickE2e }],
        },
      });
    }
  );
}
