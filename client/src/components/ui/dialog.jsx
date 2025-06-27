// filepath: /home/sushant/Desktop/Sem 6/WBD/GROUP_44/Harvest-hub-main/client/src/components/ui/dialog.jsx
import React, { useState } from "react";

export const Dialog = ({ trigger, title, description, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>{trigger}</button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-gray-600">{description}</p>
            <div className="mt-4">{children}</div>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


// import { Dialog } from "../components/ui/dialog";

// const Example = () => {
//   return (
//     <Dialog
//       trigger="Open Dialog"
//       title="Dialog Title"
//       description="This is a dialog description."
//     >
//       <p>Dialog content goes here.</p>
//     </Dialog>
//   );
// };