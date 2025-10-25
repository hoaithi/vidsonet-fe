import apiClient, { ApiResponse } from "./api-client"

interface GenerateTileRequest {
    videoFile: File
}
interface GenerateTitleResponse {
    title: string
}
interface GenerateDescriptionResponse {
    description: string
}

export const AiService = {
    generateTitle: async (videoFile: File): Promise<ApiResponse<GenerateTitleResponse[]>> => {
        const formData = new FormData();
        if(videoFile){
            formData.append("videoFile", videoFile);
        }
        const response = await apiClient.post<ApiResponse<GenerateTitleResponse[]>>(
            "/ai/generate-title",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        return response.data
    },

    generateDescription: async (videoFile: File): Promise<ApiResponse<GenerateDescriptionResponse>> => {
        const formData = new FormData();
        if(videoFile){
            formData.append("videoFile", videoFile);
        }
        const response = await apiClient.post<ApiResponse<GenerateDescriptionResponse>>(
            "/ai/generate-description",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        return response.data
    }

    
}