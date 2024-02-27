import "./resizable.css";
import React from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";

interface ResizableProps {
  direction: "horizontal" | "vertical";
  children: React.ReactNode;
}
const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableBoxProps: ResizableBoxProps;

  switch (direction) {
    case "vertical":
      resizableBoxProps = {
        height: 300,
        width: Infinity,
        resizeHandles: ["s"],
        minConstraints: [Infinity, 30],
        maxConstraints: [Infinity, window.innerHeight * 0.9],
      };
      break;
    case "horizontal":
      resizableBoxProps = {
        className: "resize-horizontal",
        height: Infinity,
        width: window.innerWidth * 0.75,
        resizeHandles: ["e"],
        minConstraints: [window.innerWidth * 0.2, Infinity],
        maxConstraints: [window.innerWidth * 0.75, Infinity],
      };
      break;
    default:
      throw new Error("Invalid direction provided to Resizable");
  }

  return <ResizableBox {...resizableBoxProps}>{children}</ResizableBox>;
};

export default Resizable;
