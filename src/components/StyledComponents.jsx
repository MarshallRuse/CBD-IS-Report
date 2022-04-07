import React from "react";
import { Typography, Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

export const Header = styled("header")({
    alignItems: "center",
    background:
        "linear-gradient(270deg, #005194, rgba(0, 71, 138, 0.7) 20%, rgba(0, 65, 132, 0.7) 50%, #003374 85%, #005194)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    padding: "2.5em",
});

export const LinkTag = styled("a")(({ theme }) => ({
    color: theme.palette.primary.main,
    textDecoration: "none",
    position: "relative",
    transition: "color 0.25s ease-out",
    "&:after": {
        content: '""',
        position: "absolute",
        bottom: -3,
        left: 0,
        backgroundColor: theme.palette.primary.main,
        height: "2px",
        transform: "scaleX(0)",
        transformOrigin: "bottom right",
        transition: "transform 0.25s ease-out",
        width: "100%",
    },
    "&:hover, &:focus": {
        color: theme.palette.primary.main,
    },
    "&:hover:after, &:focus:after": {
        transform: "scaleX(1)",
        transformOrigin: "bottom left",
    },
}));

export const Footer = styled("footer")(({ theme }) => ({
    alignItems: "center",
    color: theme.palette.text.primary,
    display: "flex",
    gap: "50px",
    justifyContent: "center",
    padding: "10px",
    width: "100%",

    "& .source a": {
        alignItems: "center",
        display: "flex",
        gap: "10px",
    },
}));

export const TablesList = styled(motion.section)({
    display: "flex",
    flexDirection: "column",
});

export const TableSection = styled("div")({
    marginBottom: "6rem",
    width: "100%",
});

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

export const InfoPanel = styled("div")({
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
