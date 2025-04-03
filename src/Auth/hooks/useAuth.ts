import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState } from "react";
import { HTTPMethodTypes } from "../../Common/types/HTTPMethodTypes";
import { authActions } from "../../Common/store/authSlice";
import { TRootState } from "../../Common/store/store";
import { sendApiRequest } from "../../Common/helpers/sendApiRequest";
import { socketActions } from "../../Common/store/socketSlice";

const useAuth = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const auth = useSelector((state: TRootState) => state.authSlice);
    const connected = useSelector((state: TRootState) => state.socketSlice.connected);
    const { POST, GET } = HTTPMethodTypes;
    const dispatch = useDispatch();

    const connectSocket = useCallback(() => {
        if (!connected) {
            dispatch(socketActions.connectSocket());
        }
    }, [connected, dispatch]);


    const signup = useCallback(async (data: Record<string, unknown>) => {
        setLoading(true);
        try {
            const response = await sendApiRequest("/auth/register", POST, data);
            return response;
        } catch (error) {
            const err = error as Error;
            setError(err.message);
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [POST]);

    const login = useCallback(async (data: Record<string, unknown>) => {
        setLoading(true);
        try {
            const response = await sendApiRequest("/auth/login", POST, data);
            if (response) {
                localStorage.setItem("token", response.data.token);
                dispatch(authActions.login({ role: response.data.role.permission, user: response.data.user }));
                connectSocket();
            }
        } catch (err) {
            const error = err as Error;
            setError(error.message);
            console.log(error);

            return null;
        } finally {
            setLoading(false);
        }
    }, [POST, connectSocket, dispatch]);

    const loginByToken = useCallback(async (token: string) => {
        setLoading(true);
        try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            const response = await sendApiRequest("/auth/" + decoded._id, GET);
            if (response) {
                dispatch(authActions.login({ role: response.data.role.permission, user: response.data.user }));
                connectSocket();
            }
        } catch (err) {
            const error = err as Error;
            setError(error.message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [GET, connectSocket, dispatch]);

    const logout = useCallback(() => {
        dispatch(authActions.logout());
        dispatch(socketActions.disconnectSocket());
        localStorage.removeItem("token");
    }, [dispatch]);

    return {
        user: auth.user,
        role: auth.role,
        error,
        loading,
        signup,
        login,
        logout,
        loginByToken
    };
};

export default useAuth;