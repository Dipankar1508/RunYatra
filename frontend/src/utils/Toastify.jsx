import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export const toast = (msg, type = "info") => {
  const gradients = {
    success: "linear-gradient(135deg, #522A9B, #7757C7, #2C2B2E,#0A0A04)",
    error: "linear-gradient(135deg, #ef4444, #dc2626)",
    warning: "linear-gradient(135deg, #f59e0b, #d97706)",
    info: "linear-gradient(135deg, #3b82f6, #2563eb)",
  };

  Toastify({
    text: msg,
    duration: 4000,
    gravity: "top",
    position: "right",
    close: true,
    progressBar: true, // ✅ progress bar enabled
    style: {
      background: gradients[type],
      borderRadius: "5px",
      padding: "14px 18px",
      fontWeight: "400",
      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    },
  }).showToast();
};
