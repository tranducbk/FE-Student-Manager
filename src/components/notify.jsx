import { Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

/**
 *
 * @param {String} type
 * @param {String} title
 * @param {String} message
 */
export function handleNotify(type, title, message) {
  Store.addNotification({
    title: title,
    message: message,
    type: type,
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 1500,
      onScreen: true,
      showIcon: true,
      click: false,
    },
  });
}
