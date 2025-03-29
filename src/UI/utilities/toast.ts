import { toast } from "react-toastify";

const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
} as const;

const successToast = (message: string) => toast.success(message, toastOptions);
const errorToast = (message: string) => toast.error(message, toastOptions);
const infoToast = (message: string) => toast.info(message, toastOptions);
const warningToast = (message: string) => toast.warn(message, toastOptions);
const defaultToast = (message: string) => toast(message, toastOptions);
const clearToast = () => toast.dismiss();

export const toastify = {
    success: successToast,
    error: errorToast,
    info: infoToast,
    warning: warningToast,
    default: defaultToast,
    clear: clearToast,
};