// uploadKey is the header value as it appears in the uploaded CSV
// outputKey is the header value as it appears in the final output tables
let rotationUIDCounter = 0;
let rotationCoordinatorUIDCounter = 0;
let EPAUIDCounter = 0;

export const rotationHeaderValues = [
    {
        transformationFunction: (data) => {
            return `${data["Power ID"]}-${data["Period"]}-${++rotationUIDCounter}`;
        },
        outputKey: "id",
    },
    { uploadKey: "Power ID", outputKey: "PowerID" },
    { uploadKey: "Period", outputKey: "Block" },
    { uploadKey: "LastName", outputKey: "LastName" },
    { uploadKey: "First Name", outputKey: "FirstName" },
    { uploadKey: "Email", outputKey: "Email" },
    { uploadKey: "PGY", outputKey: "PGY" },
    { uploadKey: "Trainee Program", outputKey: "TraineeProgram" },
    { uploadKey: "Base", outputKey: "Base" },
    { uploadKey: "Hospital", outputKey: "Hospital" },
    { uploadKey: "Rotation", outputKey: "Rotation" },
    { uploadKey: "Team", outputKey: "Team" },
    { uploadKey: "Rotation Start Date", outputKey: "RotationStartDate" },
    {
        transformationFunction: (data) => {
            return `${data["LastName"]}, ${data["First Name"]}`;
        },
        outputKey: "Resident",
    },
];

// *ExampleBodyValues are dummy values for the InfoPanel explaining each upload,
// to give an example of what the data to be uploaded looks like
export const rotationExampleBodyValues = [
    [
        { value: 2077001 },
        { value: 10 },
        { value: "Doe" },
        { value: "John" },
        { value: "John.Doe@example.com" },
        { value: "PGY1" },
        { value: "Core Medicine" },
        { value: "UHN-TGH" },
        { value: "SMH" },
        { value: "Infectious Diseases" },
        { value: "null" },
        { value: "2022-03-14" },
    ],
    [
        { value: 2077002 },
        { value: 10 },
        { value: "Stag" },
        { value: "Jane" },
        { value: "Jane.MaleUngulate@example.com" },
        { value: "PGY2" },
        { value: "Core Medicine" },
        { value: "SHSC" },
        { value: "WCH" },
        { value: "Ambulatory Medicine" },
        { value: "null" },
        { value: "2022-03-14" },
    ],
];

// uploadKey is the header value as it appears in the uploaded CSV
// outputKey is the header value as it appears in the final output tables
export const rotationCoordinatorHeaderValues = [
    {
        transformationFunction: (data) => {
            return `${data["Rotation"]}-${data["Site"]}-${++rotationCoordinatorUIDCounter}`;
        },
        outputKey: "id",
    },
    { uploadKey: "Rotation", outputKey: "Rotation" },
    { uploadKey: "Site", outputKey: "Site" },
    { uploadKey: "Rotation Coordinator", outputKey: "RotationCoordinator" },
    { uploadKey: "First Name", outputKey: "FirstName" },
    { uploadKey: "Rotation Coordinator Email", outputKey: "RotationCoordinatorEmail" },
    { uploadKey: "Assistant", outputKey: "Assistant" },
    { uploadKey: "Assistant Email", outputKey: "AssistantEmail" },
];

// *ExampleBodyValues are dummy values for the InfoPanel explaining each upload,
// to give an example of what the data to be uploaded looks like
export const rotationCoordinatorExampleBodyValues = [
    [
        { value: "Ambulatory Medicine" },
        { value: "WCH" },
        { value: "Rick Cordin" },
        { value: "Rick" },
        { value: "Rick.Coordin@wchospital.ca" },
        { value: "Amanda Assis" },
        { value: "amanda.assis@wchospital.ca" },
    ],
    [
        { value: "GIM - CTU - Consults Experience " },
        { value: "MSH" },
        { value: "Steven Schwartz" },
        { value: "Steven" },
        { value: "Steven.Schwartz@sinaihealth.ca" },
        { value: "" },
        { value: "" },
    ],
];

// uploadKey is the header value as it appears in the uploaded CSV
// outputKey is the header value as it appears in the final output tables
export const EPAsHeaderValues = [
    {
        transformationFunction: (data) => {
            return `${data["Rotation"]}-${data["Stage"]}-${++EPAUIDCounter}`;
        },
        outputKey: "id",
    },
    { uploadKey: "Rotation", outputKey: "Rotation" },
    { uploadKey: "Stage", outputKey: "Stage" },
    { uploadKey: "Priority", outputKey: "Priority" },
    { uploadKey: "Do When You Can", outputKey: "DowWhenYouCan" },
    { uploadKey: "Optional", outputKey: "Optional" },
    { uploadKey: "Rotation Cards", outputKey: "RotationCards" },
];

// *ExampleBodyValues are dummy values for the InfoPanel explaining each upload,
// to give an example of what the data to be uploaded looks like
export const EPAsExampleBodyValues = [
    [
        { value: "Cardiology" },
        { value: "TTD" },
        {
            value: "TTD-1  Performing histories and physical exams, documenting and presenting findings, across clinical settings for initial and subsequent care\nTTD-2  Identifying and assessing unstable patients, providing initial management, and obtaining help\nFOD-7  Identifying personal learning needs while caring for patients, and addressing those needs",
        },
        { value: "" },
        {
            value: "FOD-4  Formulating, communicating, and implementing discharge plans for patients with common medical conditions in acute care settings",
        },
        {
            value: "N:\\Some Path\\On the N Drive\\to\\Current-Year Rotation Cards PDF\\IM Cardiology Rotation Card TTD.pdf",
        },
    ],
    [
        { value: "Gastroenterology" },
        { value: "COD" },
        {
            value: "COD-1  Assessing, diagnosing, and managing patients with complex or atypical acute medical presentations\nCOD-2A  Assessing and managing patients with complex chronic conditions: Part A: Assessment, Diagnosis, and Management\nCOD-3A  Providing internal medicine consultation to other clinical services: Part A: Patient Assessment and Decision-Making\nCOD-4A  Assessing, resuscitating, and managing unstable and critically ill patients: Part A: Patient care",
        },
        {
            value: "COD-5  Performing the procedures of Internal Medicine\nCOD-8  Caring for patients who have experienced a patient safety incident (adverse event)",
        },
        {
            value: "COD-3C  Providing internal medicine consultation to other clinical services: Part C: Oral Communication\nCOD-6  Assessing capacity for medical decision-making\nCOD-10  Implementing health promotion strategies in patients with or at risk for disease",
        },
        {
            value: "N:\\Some Path\\On the N Drive\\to\\Current-Year Rotation Cards PDF\\IM Gastroentrology Rotation Card COD.pdf",
        },
    ],
];
