import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../../Core/store/store";
import { themeActions, TThemState } from "../../Core/store/themeSlice";
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