import React from "react";
import { Typography, Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

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

export const InfoPanel = styled(motion.section)({
    backgroundColor: "#FAFAFA",
    padding: "2rem 4rem",
    "& p": {
        margin: "0.75em 0",
    },
});

export const WrapLineBreaks = styled("span")({
    lineHeight: "1.5em",
    whiteSpace: "pre",
});

export const WrappingTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        lineHeight: "1.5em",
        maxWidth: "fit-content",
        whiteSpace: "pre",
    },
}));

export const formatAsWrappingCell = (params) => {
    return (
        <WrappingTooltip title={params.value} style={{ whiteSpace: "pre" }}>
            <WrapLineBreaks>{params.value}</WrapLineBreaks>
        </WrappingTooltip>
    );
};
