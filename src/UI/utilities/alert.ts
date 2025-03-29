import swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const alert = async (
    title: string,
    text: string,
    icon: SweetAlertIcon = "info"
) => {
    await withReactContent(swal)
        .fire({
            title,
            text,
            icon,
        })
};