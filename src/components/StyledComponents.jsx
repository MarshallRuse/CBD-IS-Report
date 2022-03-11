import React from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const PageColumn = styled("div")({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: "3rem",
    margin: "0 auto 50px auto",
    overflow: "hidden",
    width: "clamp(350px, 80vw, 1200px)",
});

export const InputContainer = styled("div")({
    width: "100%",
});

export const InputLabel = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    marginBottom: "0.5em",
}));
