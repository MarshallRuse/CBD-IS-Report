import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

const StyledMessage = styled(motion.span)((props) => ({
    background:
        props.type === "success"
            ? "linear-gradient(140deg, hsl(141deg 31% 50%), hsl(141deg 31% 45%))"
            : "linear-gradient(140deg, #E31837, hsl(351deg 78% 46%))",
    borderRadius: "4px",
    boxShadow: "4px 4px 10px 2px rgb(0 0 0 / 0.1)",
    color: "#fff",
    display: "inline-block",
    fontSize: "1rem",
    marginLeft: "1rem",
    padding: "1em",
    verticalAlign: "text-bottom",
}));

const variants = {
    visible: { x: 0, opacity: 1 },
    hidden: { x: "75vw", opacity: 0 },
};

export default function UploadStatusMessage(props) {
    const { message, display, alertType = "success" } = props;

    return (
        <StyledMessage
            key='UploadStatusMessage'
            variants={variants}
            initial='hidden'
            animate={display ? "visible" : "hidden"}
            transition={{ type: "spring", duration: 0.7 }}
            type={alertType}
        >
            {message}
        </StyledMessage>
    );
}
