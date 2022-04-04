import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        type: "light",
        official: {
            main: "#002A5C",
            light: "rgb(51, 84, 124)",
            dark: "rgb(0, 29, 64)",
            contrastText: "#fff",
        },
        primary: {
            main: "#007FAD",
            dark: "00537D",
            light: "54AEDF",
        },
        secondary: {
            main: "#E31837",
        },
        text: {
            primary: "rgba(0,0,0,0.8)",
        },
        RCData: {
            primary: "rgba(123, 220, 255, 0.2)",
        },
        EPAData: {
            primary: "rgba(116, 255, 213, 0.2)",
        },
    },
    typography: {
        h1: {
            fontSize: "2.5rem",
        },
    },
});

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
