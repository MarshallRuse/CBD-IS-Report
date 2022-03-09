import { useEffect, useState } from "react";
import { Grid, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

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
    { field: "RotationCoordinator", headerName: "Rotation Coordinator", minWidth: defaultMinColWidth, flex: 1 },
    { field: "RCFirstName", headerName: "RC First Name", minWidth: 120, flex: 1 },
    { field: "RCEmail", headerName: "RC Email", minWidth: defaultMinColWidth, flex: 1 },
    { field: "Assistant", headerName: "Assistant", minWidth: defaultMinColWidth, flex: 1 },
    { field: "AssistantEmail", headerName: "Assistant Email", minWidth: defaultMinColWidth, flex: 1 },
];

export default function AllRotationsDataGrid(props) {
    const { rotationsData, rotationCoordinatorDataAvailable = false } = props;

    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        RotationCoordinator: false,
        RCFirstName: false,
        RCEmail: false,
        Assistant: false,
        AssistantEmail: false,
    });

    useEffect(() => {
        setColumnVisibilityModel({
            RotationCoordinator: rotationCoordinatorDataAvailable,
            RCFirstName: rotationCoordinatorDataAvailable,
            RCEmail: rotationCoordinatorDataAvailable,
            Assistant: rotationCoordinatorDataAvailable,
            AssistantEmail: rotationCoordinatorDataAvailable,
        });
    }, [rotationCoordinatorDataAvailable]);

    return (
        <>
            {rotationsData.length > 0 && (
                <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                        rows={rotationsData}
                        columns={columns}
                        columnVisibilityModel={columnVisibilityModel}
                        disableSelectionOnClick
                    />
                </div>
            )}
        </>
    );
}
