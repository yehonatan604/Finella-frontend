import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { HTTPMethodTypes } from "../../Common/enums/HTTPMethodTypes";
import { authActions } from "../../Core/store/authSlice";
import { TRootState } from "../../Core/store/store";
import { sendApiRequest } from "../../Common/helpers/sendApiRequest";
import { socketActions } from "../../Core/store/socketSlice";
import { toastify } from "../../Common/utilities/toast";
import { alert } from "../../Common/utilities/alert";
import { AxiosError } from "axios";
import useSocket from "../../Common/hooks/useSocket";

const useAuth = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { user, role } = useSelector((state: TRootState) => state.authSlice);
    const { POST, GET } = HTTPMethodTypes;
    const dispatch = useDispatch();
    useSocket(user);

    const signup = useCallback(async (data: Record<string, unknown>) => {
        setLoading(true);
        try {
            const response = await sendApiRequest("/auth/register", POST, data);
            await alert(
                "Sign Up",
                "Account created successfully, please check your email to verify your account.",
                "success",
            )
            return response;
        } catch (error) {
            const err = error as AxiosError;
            await alert(
                "Signup Failed",
                err?.response?.data + "",
                "error",
            );
        } finally {
            setLoading(false);
        }
    }, [POST]);

    const logout = useCallback(() => {
        dispatch(authActions.logout());
        localStorage.removeItem("token");
    }, [dispatch])

    const login = useCallback(async (data: Record<string, unknown>) => {
        setLoading(true);
        try {
            const response = await sendApiRequest("/auth/login", POST, data);
            if (response) {
                localStorage.setItem("token", response.data.token);
                dispatch(authActions.login({ role: response.data.role.permission, user: response.data.user }));
                toastify.success("Login successful!");
            }
        } catch (err) {
            const error = err as AxiosError;
            console.log(error);
            await alert(
                "Login Failed",
                error?.response?.data + "",
                "error",
            );
        } finally {
            setLoading(false);
        }
    }, [POST, dispatch]);

    const loginByToken = useCallback(async (token: string) => {
        setLoading(true);
        try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            const response = await sendApiRequest("/auth/" + decoded._id, GET);
            if (response) {
                dispatch(authActions.login({ role: response.data.role.permission, user: response.data.user }));
            }
        } catch (err) {
            const error = err as Error;
            console.log(error);
            logout();
        } finally {
            setLoading(false);
        }
    }, [GET, dispatch, logout]);;

    useEffect(() => {
        if (user) {
            dispatch(socketActions.connectSocket());
        } else {
            dispatch(socketActions.disconnectSocket());
        }
    }, [user, dispatch]);

    return {
        user: user,
        role: role,
        loading,
        signup,
        login,
        logout,
        loginByToken
    };
};

export default useAuth;