import { useState } from "react";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ExpandMore, Info } from "@mui/icons-material";
import { InfoPanel, LinkTag } from "./StyledComponents";

const Title = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
    cursor: "pointer",
    display: "flex",
    alignSelf: "flex-start",
    alignItems: "center",
    margin: 0,
}));

const NumberedList = styled("ol")(({ theme }) => ({
    listStyle: "none",
    counterReset: "item",
    "& li": {
        counterIncrement: "item",
        margin: "1em 0",
        "&:before": {
            marginRight: "10px",
            padding: "0.25em",
            content: "counter(item)",
            background: theme.palette.primary.main,
            borderRadius: "50%",
            color: "white",
            width: "1.2em",
            textAlign: "center",
            verticalAlign: "middle",
            display: "inline-block",
        },
    },
}));

const List = styled("ul")(({ theme }) => ({
    "& li": {
        listStyle: "none",
        margin: "1em 0",
        "&:before": {
            content: '""',
            backgroundColor: theme.palette.primary.main,
            borderRadius: "50%",
            display: "inline-block",
            marginRight: "10px",
            padding: "0.25em",
            width: "1em",
            height: "1em",
            verticalAlign: "middle",
        },
    },
}));

const MissingValueStyle = styled("span")(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    color: "#fff",
}));

export default function ExplanationPanel() {
    const [panelOpen, setPanelOpen] = useState(false);

    return (
        <div>
            <Title onClick={() => setPanelOpen(!panelOpen)} component='h2' variant='h5'>
                What is this?
                <motion.span
                    key='Explanation-Expansion-Icon'
                    animate={panelOpen ? "open" : "collapsed"}
                    variants={{
                        open: { rotate: 180 },
                        collapsed: { rotate: 0 },
                    }}
                    initial='collapsed'
                    style={{ display: "flex" }}
                >
                    <ExpandMore fontSize='large' />
                </motion.span>
            </Title>
            <motion.section
                key='Explanation-Section'
                animate={panelOpen ? "open" : "collapsed"}
                variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0, overflow: "hidden" },
                }}
                initial='collapsed'
                transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
                <InfoPanel>
                    <Typography variant='h5' component='h3' color='primary' sx={{ marginBottom: "1em" }}>
                        <strong>Welcome to the Rotation Coordinator Report Formatter!</strong>
                    </Typography>
                    <Typography color='primary'>(Rolls off the tongue, doesn't it?)</Typography>
                    <Typography>
                        This little web app was built to replace what was previously an elaborate Excel macro. The idea
                        is that it takes as input 3 CSV files:
                    </Typography>
                    <NumberedList>
                        <li>
                            Rotations exported from the{" "}
                            <LinkTag href='https://www.orbs.utoronto.ca/' target='_blank'>
                                Online Rotation & Base Hospital Scheduling (ORBS)
                            </LinkTag>{" "}
                        </li>
                        <li>
                            A reference table for the Rotation Coordinators of the rotations listed in the rotations
                            file
                        </li>
                        <li>
                            A reference table for the EPAs to be completed on the rotations listed in the rotations
                            file.
                        </li>
                    </NumberedList>
                    <Typography>
                        Click the <Info sx={{ color: "rgba(0,0,0,0.5)", verticalAlign: "text-bottom" }} /> info-icon
                        attached to each upload input to view which headers are required. Files uploaded with
                        <MissingValueStyle> incorrect headers will have them highlighted.</MissingValueStyle>
                    </Typography>
                    <Typography>It takes these inputs and groups the residents taking each rotation by:</Typography>
                    <List>
                        <li>the rotation,</li>
                        <li>the site its taking place at,</li>
                        <li>and the residents' seniority (i.e. Juniors or Seniors).</li>
                    </List>
                    <Typography>
                        All of the uploading and data manipulation is done <em>entirely</em> within the browser, and
                        there is no outbound network traffic, so the data uploaded is secure.
                    </Typography>
                    <Typography>
                        This web app is primarily meant for use with the University of Toronto's Internal Medicine
                        program, but is not endorsed by the university (hence the lack of any branding). I, Marshall
                        Ruse (
                        <LinkTag href='https://marshallruse.com' target='_blank' style={{ fontSize: "0.8em" }}>
                            semi-shameless self-promotion
                        </LinkTag>
                        ) simply got tired of rewriting the Excel VBA script that used to do this, as I'm much more
                        familiar with JavaScript and can tweak the code here as needed. I figured the need for this
                        report-formatting may outlast my time here, so I hosted the app online for the next person.
                    </Typography>
                </InfoPanel>
            </motion.section>
        </div>
    );
}
