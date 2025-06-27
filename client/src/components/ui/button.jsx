// filepath: /home/sushant/Desktop/Sem 6/WBD/GROUP_44/Harvest-hub-main/client/src/components/ui/button.jsx
import React from "react";
import clsx from "clsx";

export const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={clsx(
        "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};