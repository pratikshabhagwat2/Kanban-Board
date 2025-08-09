import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Fix for react-beautiful-dnd in React 18 Strict Mode
// The library has issues with getBoundingClientRect returning different values
// This hack ensures consistent values during development
const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
HTMLElement.prototype.getBoundingClientRect = function() {
  const rect = originalGetBoundingClientRect.call(this);
  if (rect.x === 0 && rect.y === 0) {
    return rect;
  }
  
  // Create an immutable object that matches the expected DOMRect interface
  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width,
    x: rect.x,
    y: rect.y,
    toJSON: rect.toJSON
  };
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
