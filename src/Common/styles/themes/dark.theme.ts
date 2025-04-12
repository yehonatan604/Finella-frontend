import { createTheme } from "@mui/material/styles";
import { blue, green, red } from "@mui/material/colors";

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#0f172a",  // Navy-ish background
            paper: "#1a2238",    // Cards, dialogs, etc.
        },
        primary: {
            main: blue[600],
            light: blue[300],
            dark: blue[800],
        },
        success: {
            main: green[500],
            light: green[300],
            dark: green[700],
        },
        error: {
            main: red[500],
            light: red[300],
            dark: red[700],
        },
        text: {
            primary: "#e3f2fd",
            secondary: "#b0bec5",
        },
    },
    components: {
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: "#1e2b45",
                    color: "#e3f2fd",
                    borderRadius: 8,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: blue[400],
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: blue[300],
                    },
                },
                notchedOutline: {
                    borderColor: "#334155",
                },
                input: {
                    color: "#e3f2fd",
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: "#90a4ae",
                    "&.Mui-focused": {
                        color: blue[300],
                    },
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: "#e0f7fa",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: "#1a2238",
                    color: "#e3f2fd",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                },
                containedPrimary: {
                    backgroundColor: blue[600],
                    color: "#fff",
                    "&:hover": {
                        backgroundColor: blue[700],
                    },
                },
                outlinedPrimary: {
                    borderColor: blue[400],
                    color: blue[300],
                    "&:hover": {
                        backgroundColor: "rgba(33,150,243,0.08)",
                        borderColor: blue[300],
                    },
                },
                textPrimary: {
                    color: blue[300],
                },
                containedSuccess: {
                    backgroundColor: green[600],
                    color: "#fff",
                    "&:hover": {
                        backgroundColor: green[700],
                    },
                },
                containedError: {
                    backgroundColor: red[600],
                    color: "#fff",
                    "&:hover": {
                        backgroundColor: red[700],
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    background: `linear-gradient(180deg, ${blue[900]} 0%, ${blue[800]} 100%)`,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: `linear-gradient(90deg, ${blue[900]} 0%, ${blue[700]} 100%)`,
                },
            },
        },
    },
});
