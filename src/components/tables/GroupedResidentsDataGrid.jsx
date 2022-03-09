import { Grid, Tooltip, tooltipClasses } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";

const WrapLineBreaks = styled("span")({
    lineHeight: "1.5em",
    whiteSpace: "pre",
});

const WrappingTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            lineHeight: "1.5em",
            whiteSpace: "pre",
        },
    })
);

const formatAsWrappingCell = (params) => {
    return (
        <WrappingTooltip title={params.value} style={{ whiteSpace: "pre" }}>
            <WrapLineBreaks>{params.value}</WrapLineBreaks>
        </WrappingTooltip>
    );
};

const columns = [
    {
        field: "Block",
        headerName: "Block",
        type: "number",
        width: 75,
    },
    {
        field: "Rotation",
        headerName: "Rotation",
        minWidth: 55,
        flex: 1,
    },
    {
        field: "Hospital",
        headerName: "Hospital",
        minWidth: 55,
        flex: 1,
    },
    {
        field: "PGY1s",
        headerName: "PGY1s",
        minWidth: 55,
        flex: 1,
        renderCell: formatAsWrappingCell,
    },
    {
        field: "PGY1Emails",
        headerName: "PGY1 Emails",
        minWidth: 55,
        flex: 1,
        renderCell: formatAsWrappingCell,
    },
    { field: "PGY2s", headerName: "PGY2s", minWidth: 55, flex: 1, renderCell: formatAsWrappingCell },
    {
        field: "PGY2Emails",
        headerName: "PGY2 Emails",
        minWidth: 55,
        flex: 1,
        renderCell: formatAsWrappingCell,
    },
    { field: "PGY3s", headerName: "PGY3s", minWidth: 55, flex: 1 },
    {
        field: "PGY3Emails",
        headerName: "PGY3 Emails",
        minWidth: 55,
        flex: 1,
        renderCell: formatAsWrappingCell,
    },
];

export default function GroupedResidentsDataGrid(props) {
    const { rotationsData } = props;
    return (
        <>
            {rotationsData.length > 0 && (
                <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                        rows={rotationsData}
                        getRowHeight={(params) => {
                            console.log("params: ", params);
                            const maxNameRows = Math.max(
                                params.model.PGY1s.split("\n").length,
                                params.model.PGY2s.split("\n").length,
                                params.model.PGY3s.split("\n").length
                            );
                            if (maxNameRows > 1) {
                                return 30 + 20 * maxNameRows;
                            } else {
                                return null;
                            }
                        }}
                        columns={columns}
                        disableSelectionOnClick
                    />
                </div>
            )}
        </>
    );
}
