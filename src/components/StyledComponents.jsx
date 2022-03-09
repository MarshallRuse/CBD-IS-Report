import React from "react";
import { styled } from "@mui/material/styles";

export const PageColumn = styled("div")({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    margin: "50px auto",
    width: "clamp(350px, 80vw, 1200px)",
});
