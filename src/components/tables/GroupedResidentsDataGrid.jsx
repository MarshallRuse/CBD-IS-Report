import { useState, useEffect } from "react";
import { Grid, Tooltip, tooltipClasses } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
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

const defaultMinColWidth = 200;
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
        minWidth: defaultMinColWidth,
        flex: 1,
    },
    {
        field: "Hospital",
        headerName: "Hospital",
        minWidth: 100,
        flex: 1,
    },
    {
        field: "PGY1s",
        headerName: "PGY1s",
        minWidth: defaultMinColWidth,
        flex: 1,
        renderCell: formatAsWrappingCell,
    },
    {
        field: "PGY1Emails",
        headerName: "PGY1 Emails",
        minWidth: defaultMinColWidth,
        flex: 1,
        renderCell: formatAsWrappingCell,
    },
    { field: "PGY2s", headerName: "PGY2s", minWidth: defaultMinColWidth, flex: 1, renderCell: formatAsWrappingCell },
    {
        field: "PGY2Emails",
        headerName: "PGY2 Emails",
        minWidth: defaultMinColWidth,
        flex: 1,
        renderCell: formatAsWrappingCell,
    },
    { field: "PGY3s", headerName: "PGY3s", minWidth: defaultMinColWidth, flex: 1 },
    {
        field: "PGY3Emails",
        headerName: "PGY3 Emails",
        minWidth: defaultMinColWidth,
        flex: 1,
        renderCell: formatAsWrappingCell,
    },
    {
        field: "RotationCoordinator",
        headerName: "Rotation Coordinator",
        minWidth: defaultMinColWidth,
        flex: 1,
        cellClassName: "rc-data",
    },
    { field: "RCFirstName", headerName: "RC First Name", minWidth: 120, flex: 1, cellClassName: "rc-data" },
    { field: "RCEmail", headerName: "RC Email", minWidth: defaultMinColWidth, flex: 1, cellClassName: "rc-data" },
    { field: "Assistant", headerName: "Assistant", minWidth: defaultMinColWidth, flex: 1, cellClassName: "rc-data" },
    {
        field: "AssistantEmail",
        headerName: "Assistant Email",
        minWidth: defaultMinColWidth,
        flex: 1,
        cellClassName: "rc-data",
    },
    {
        field: "JuniorPriority",
        headerName: "Junior Priority",
        minWidth: defaultMinColWidth,
        flex: 1,
        renderCell: formatAsWrappingCell,
        cellClassName: "epa-data",
    },
    {
        field: "JuniorDoWhenYouCan",
        headerName: "Junior Do When You Can",
        minWidth: defaultMinColWidth,
        flex: 1,
        renderCell: formatAsWrappingCell,
        cellClassName: "epa-data",
    },
    {
        field: "JuniorOptional",
        headerName: "Senior Optional",
        minWidth: defaultMinColWidth,
        flex: 1,
        renderCell: formatAsWrappingCell,
        cellClassName: "epa-data",
    },
    {
        field: "SeniorPriority",
        headerName: "Senior Priority",
        minWidth: defaultMinColWidth,
        flex: 1,
        renderCell: formatAsWrappingCell,
        cellClassName: "epa-data",
    },
    {
        field: "SeniorDoWhenYouCan",
        headerName: "Senior Do When You Can",
        minWidth: defaultMinColWidth,
        flex: 1,
        renderCell: formatAsWrappingCell,
        cellClassName: "epa-data",
    },
    {
        field: "SeniorOptional",
        headerName: "Senior Optional",
        minWidth: defaultMinColWidth,
        flex: 1,
        renderCell: formatAsWrappingCell,
        cellClassName: "epa-data",
    },
    {
        field: "JuniorRotationCards",
        headerName: "Junior Rotation Cards",
        minWidth: defaultMinColWidth,
        flex: 1,
        renderCell: formatAsWrappingCell,
        cellClassName: "epa-data",
    },
    {
        field: "SeniorRotationCards",
        headerName: "Senior Rotation Cards",
        minWidth: defaultMinColWidth,
        flex: 1,
        renderCell: formatAsWrappingCell,
        cellClassName: "epa-data",
    },
];

export default function GroupedResidentsDataGrid(props) {
    const { rotationsData, rotationCoordinatorDataAvailable = false, EPADataAvailable = false, groupType = "" } = props;

    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        RotationCoordinator: false,
        RCFirstName: false,
        RCEmail: false,
        Assistant: false,
        AssistantEmail: false,
        JuniorPriority: false,
        JuniorDoWhenYouCan: false,
        JuniorOptional: false,
        SeniorPriority: false,
        SeniorDoWhenYouCan: false,
        SeniorOptional: false,
        JuniorRotationCards: false,
        SeniorRotationCards: false,
    });

    const CustomToolbar = () => {
        const uniqueBlocks = rotationsData
            .map((rot) => parseInt(rot.Block))
            .filter((block, ind, self) => self.indexOf(block) === ind);
        const blocksName =
            uniqueBlocks.length > 1
                ? `Blocks ${Math.min(...uniqueBlocks)}-${Math.max(...uniqueBlocks)}`
                : `Block ${uniqueBlocks[0]}`;

        return (
            <GridToolbarContainer sx={{ justifyContent: "flex-end", padding: "0.5em" }}>
                <GridToolbarExport
                    csvOptions={{
                        fileName: `${blocksName} Rotation Coordinator - ${groupType}`,
                    }}
                />
            </GridToolbarContainer>
        );
    };
    useEffect(() => {
        setColumnVisibilityModel({
            RotationCoordinator: rotationCoordinatorDataAvailable,
            RCFirstName: rotationCoordinatorDataAvailable,
            RCEmail: rotationCoordinatorDataAvailable,
            Assistant: rotationCoordinatorDataAvailable,
            AssistantEmail: rotationCoordinatorDataAvailable,
            JuniorPriority: EPADataAvailable,
            JuniorDoWhenYouCan: EPADataAvailable,
            JuniorOptional: EPADataAvailable,
            SeniorPriority: EPADataAvailable,
            SeniorDoWhenYouCan: EPADataAvailable,
            SeniorOptional: EPADataAvailable,
            JuniorRotationCards: EPADataAvailable,
            SeniorRotationCards: EPADataAvailable,
        });
    }, [rotationCoordinatorDataAvailable, EPADataAvailable]);

    return (
        <>
            {rotationsData.length > 0 && (
                <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                        rows={rotationsData}
                        getRowHeight={(params) => {
                            //console.log("params: ", params);
                            const maxLinesInRow = Math.max(
                                params.model.PGY1s.split("\n").length,
                                params.model.PGY2s.split("\n").length,
                                params.model.PGY3s.split("\n").length,
                                params.model.JuniorPriority.split("\n").length,
                                params.model.JuniorDoWhenYouCan.split("\n").length,
                                params.model.JuniorOptional.split("\n").length,
                                params.model.SeniorPriority.split("\n").length,
                                params.model.SeniorDoWhenYouCan.split("\n").length,
                                params.model.SeniorOptional.split("\n").length,
                                params.model.JuniorRotationCards.split("\n").length,
                                params.model.SeniorRotationCards.split("\n").length
                            );
                            if (maxLinesInRow > 1) {
                                return 30 + 20 * maxLinesInRow;
                            } else {
                                return null;
                            }
                        }}
                        columns={columns}
                        columnVisibilityModel={columnVisibilityModel}
                        components={{
                            Toolbar: CustomToolbar,
                        }}
                        sx={{
                            "& .rc-data": {
                                backgroundColor: "RCData.primary",
                            },
                            "& .epa-data": {
                                backgroundColor: "EPAData.primary",
                            },
                        }}
                        disableSelectionOnClick
                    />
                </div>
            )}
        </>
    );
}
