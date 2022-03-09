import { Grid, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
    {
        field: "Block",
        headerName: "Block",
        type: "number",
        width: 50,
        renderCell: (params) => {
            return (
                <Tooltip title={params.row.RotationStartDate}>
                    <span>{params.value}</span>
                </Tooltip>
            );
        },
    },
    { field: "Rotation", headerName: "Rotation", flex: 1 },
    { field: "Hospital", headerName: "Hospital", flex: 1 },
    { field: "LastName", headerName: "Last Name", flex: 1 },
    { field: "FirstName", headerName: "First Name", flex: 1 },
    { field: "Resident", headerName: "Resident", flex: 1 },
    { field: "Email", headerName: "Email", flex: 1 },
    { field: "PGY", headerName: "PGY", width: 75 },
    { field: "TraineeProgram", headerName: "Trainee Program", flex: 1 },
    { field: "Team", headerName: "Team", flex: 1 },
];

export default function AllRotationsDataGrid(props) {
    const { rotationsData } = props;
    return (
        <>
            {rotationsData.length > 0 && (
                <div style={{ height: 400, width: "100%" }}>
                    <DataGrid rows={rotationsData} columns={columns} disableSelectionOnClick />
                </div>
            )}
        </>
    );
}
