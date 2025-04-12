import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../store/store";
import { themeActions, TThemState } from "../store/themeSlice";
import { TTheme } from "../types/TTheme";

const useTheme = () => {
    const theme = useSelector<TRootState, TThemState>((state) => state.themeSlice);
    const mode = theme.mode as TTheme;
    const dispatch = useDispatch();

    const setTheme = (mode: TTheme) => {
        dispatch(themeActions.setTheme(mode));
        localStorage.setItem("mode", mode);
    };

    return { mode, setTheme };
}

export default useTheme;