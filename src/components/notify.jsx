import { notification } from "antd";

/**
 *
 * @param {String} type - 'success', 'error', 'info', 'warning'
 * @param {String} title
 * @param {String} message
 */
export function handleNotify(type, title, message) {
  let notificationType;
  const t = (type || "").toLowerCase();

  switch (t) {
    case "danger":
    case "error":
      notificationType = "error";
      break;
    case "warning":
      notificationType = "warning";
      break;
    case "info":
      notificationType = "info";
      break;
    case "success":
      notificationType = "success";
      break;
    default:
      notificationType = "success";
  }

  let isDark = false;
  try {
    isDark =
      typeof localStorage !== "undefined" &&
      localStorage.getItem("theme") === "dark";
  } catch {}

  notification[notificationType]({
    message: title,
    description: message,
    placement: "bottomRight",
    duration: 3,
    className: isDark ? "dark-notification" : "light-notification",
  });
}
