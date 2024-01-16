export type ChatRequest = {
    filepath: string;
    entireContent: string,
    selectedContent: string,
    userQuery: string,
}

export type ChatResponse = {
    id: string;
    response: string;
}