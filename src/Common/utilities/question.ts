import swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const question = async (
  title: string,
  text: string | Element,
  icon: SweetAlertIcon = "warning",
  onConfirm: () => void = () => { },
  onCancel: () => void = () => { },
  confirmButtonText: string = "Yes",
  cancelButtonText: string = "No"
) => {
  withReactContent(swal)
    .fire({
      title,
      html: text as Element,
      icon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      showCloseButton: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      } else {
        onCancel();
      }
    });
};
