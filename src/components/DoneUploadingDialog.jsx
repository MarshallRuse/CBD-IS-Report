import { forwardRef } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Zoom } from "@mui/material";
import { SaveAlt } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import ImgExportDataDemo from "../assets/images/Export_Data_Demo.png";

const Transition = forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

const Img = styled("img")({
    marginBottom: "2rem",
    width: "100%",
});

const ExportSpan = styled("span")(({ theme }) => ({
    color: theme.palette.primary.main,
    fontSize: "0.8125rem",
    fontWeight: 500,
    letterSpacing: "0.02857em",
    lineHeight: 1.75,

    "& svg": {
        boxSizing: "border-box",
        verticalAlign: "text-bottom",
    },
}));

export default function DoneUploadingDialog({ open, closeDialog }) {
    const handleCloseDialog = () => {
        closeDialog();
    };

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            aria-describedby='done-uploading-dialog-description'
        >
            <DialogTitle sx={{ p: "2rem" }}>Done uploading!</DialogTitle>
            <DialogContent sx={{ p: "2rem", scrollbarColor: "primary.main", scrollbarWidth: "thin" }}>
                <DialogContentText sx={{ mb: "2rem" }}>
                    You're done uploading. Check the tables below to make sure that everything looks as expected.
                    Remember you can filter out blocks, programs, and rotations as needed.
                </DialogContentText>
                <DialogContentText sx={{ mb: "2rem" }}>
                    If everything looks right, click the{" "}
                    <ExportSpan>
                        <SaveAlt />
                        EXPORT
                    </ExportSpan>{" "}
                    button on each of the tables, and then Download as CSV.
                </DialogContentText>
                <Img src={ImgExportDataDemo} alt='Demonstration of the Export button on each table.' />
                <DialogContentText sx={{ mb: "2rem" }}>
                    Use the CSV's in your Mail Merge email template and you're all set!
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: "2rem", pt: 0 }}>
                <Button variant='outlined' onClick={handleCloseDialog}>
                    Got It
                </Button>
            </DialogActions>
        </Dialog>
    );
}
