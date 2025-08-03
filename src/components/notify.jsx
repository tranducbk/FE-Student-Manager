import { notification } from "antd";

/**
 *
 * @param {String} type - 'success', 'error', 'info', 'warning'
 * @param {String} title
 * @param {String} message
 */
export function handleNotify(type, title, message) {
  let notificationType;

  switch (type) {
    case "danger":
      notificationType = "error";
      break;
    case "warning":
      notificationType = "warning";
      break;
    case "info":
      notificationType = "info";
      break;
    default:
      notificationType = "success";
  }

  const isDark = document.documentElement.classList.contains("dark");

  notification[notificationType]({
    message: title,
    description: message,
    placement: "bottomRight",
    duration: 3,
    className: isDark ? "dark-notification" : "light-notification",
  });
}
