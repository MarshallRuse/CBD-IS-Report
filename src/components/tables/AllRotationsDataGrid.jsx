import { useEffect, useState } from "react";
import { Grid, Tooltip } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";

const defaultMinColWidth = 200;
const columns = [
    {
        field: "Block",
        headerName: "Block",
        type: "number",
        minWidth: 75,
        flex: 1,
        renderCell: (params) => {
            return (
                <Tooltip title={params.row.RotationStartDate}>
                    <span>{params.value}</span>
                </Tooltip>
            );
        },
    },
    { field: "Rotation", headerName: "Rotation", minWidth: defaultMinColWidth, flex: 1 },
    { field: "Hospital", headerName: "Hospital", minWidth: 100, flex: 1 },
    { field: "LastName", headerName: "Last Name", minWidth: defaultMinColWidth, flex: 1 },
    { field: "FirstName", headerName: "First Name", minWidth: defaultMinColWidth, flex: 1 },
    { field: "Resident", headerName: "Resident", minWidth: defaultMinColWidth, flex: 1 },
    { field: "Email", headerName: "Email", minWidth: defaultMinColWidth, flex: 1 },
    { field: "PGY", headerName: "PGY", minWidth: 75, flex: 1 },
    { field: "TraineeProgram", headerName: "Trainee Program", minWidth: defaultMinColWidth, flex: 1 },
    { field: "Team", headerName: "Team", minWidth: 100, flex: 1 },
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
        cellClassName: "epa-data",
    },
    {
        field: "JuniorDoWhenYouCan",
        headerName: "Junior Do When You Can",
        minWidth: defaultMinColWidth,
        flex: 1,
        cellClassName: "epa-data",
    },
    {
        field: "JuniorOptional",
        headerName: "Senior Optional",
        minWidth: defaultMinColWidth,
        flex: 1,
        cellClassName: "epa-data",
    },
    {
        field: "SeniorPriority",
        headerName: "Senior Priority",
        minWidth: defaultMinColWidth,
        flex: 1,
        cellClassName: "epa-data",
    },
    {
        field: "SeniorDoWhenYouCan",
        headerName: "Senior Do When You Can",
        minWidth: defaultMinColWidth,
        flex: 1,
        cellClassName: "epa-data",
    },
    {
        field: "SeniorOptional",
        headerName: "Senior Optional",
        minWidth: defaultMinColWidth,
        flex: 1,
        cellClassName: "epa-data",
    },
    {
        field: "JuniorRotationCards",
        headerName: "Junior Rotation Cards",
        minWidth: defaultMinColWidth,
        flex: 1,
        cellClassName: "epa-data",
    },
    {
        field: "SeniorRotationCards",
        headerName: "Senior Rotation Cards",
        minWidth: defaultMinColWidth,
        flex: 1,
        cellClassName: "epa-data",
    },
];

export default function AllRotationsDataGrid(props) {
    const { rotationsData, rotationCoordinatorDataAvailable = false, EPADataAvailable = false } = props;

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
                        fileName: `${blocksName} Rotation Coordinator - All Residents`,
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
