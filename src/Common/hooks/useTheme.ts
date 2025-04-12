export type TTheme = "light" | "dark";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../store/store";
import { themeActions, TThemState } from "../store/themeSlice";

const useTheme = () => {
    const theme = useSelector<TRootState, TThemState>((state) => state.themeSlice);
    const mode = theme.mode as TTheme;
    const dispatch = useDispatch();

    const setTheme = (mode: TTheme) => {
        dispatch(themeActions.setTheme(mode));
    };

    return { mode, setTheme };
}

export default useTheme;