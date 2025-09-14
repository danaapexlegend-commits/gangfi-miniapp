// components/Modal.jsx
import React from "react";

/*
  A simple reusable modal component
  Props:
   - show: boolean -> if true modal is visible
   - onClose: function -> called when user clicks close
   - title: string -> modal title
   - children: content inside modal
*/

export default function Modal({ show, onClose, title, children }) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#0d0033ff",
          padding: 20,
          borderRadius: 10,
          maxWidth: 500,
          width: "90%",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: 15 }}>{title}</h2>
        <div>{children}</div>
        <button
          style={{
            marginTop: 20,
            background: "#2b6cb0",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: 6,
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
