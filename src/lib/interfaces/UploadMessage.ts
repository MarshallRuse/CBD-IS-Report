export type UploadMessage = {
    fileName?: string;
    uploadMessageText?: string;
    uploadMessageType?: "success" | "error" | "";
    displayMessaging?: boolean;
};
