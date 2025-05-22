import apiClient, { ApiResponse } from './api-client';
import {
    MembershipTier,
    Membership,
    MembershipTierCreateRequest,
    MembershipTierUpdateRequest,
    CreatePaymentResponse,
    PaymentCaptureResponse
} from '@/types/membership';

export const MembershipService = {
    // Create a new membership tier
    createMembershipTier: async (data: MembershipTierCreateRequest): Promise<ApiResponse<MembershipTier>> => {
        const response = await apiClient.post<ApiResponse<MembershipTier>>('/memberships/tiers', data);
        return response.data;
    },

    // Update an existing membership tier
    updateMembershipTier: async (tierId: number, data: MembershipTierUpdateRequest): Promise<ApiResponse<MembershipTier>> => {
        const response = await apiClient.put<ApiResponse<MembershipTier>>(`/memberships/tiers/${tierId}`, data);
        return response.data;
    },

    // Delete a membership tier
    deleteMembershipTier: async (tierId: number): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<ApiResponse<void>>(`/memberships/tiers/${tierId}`);
        return response.data;
    },

    // Get all membership tiers for a channel
    getChannelMembershipTiers: async (channelId: number): Promise<ApiResponse<MembershipTier[]>> => {
        const response = await apiClient.get<ApiResponse<MembershipTier[]>>(`/memberships/tiers/channel/${channelId}`);
        console.log('Membership tiers:', response.data);
        return response.data;
    },

    // Get a specific membership tier
    getMembershipTierById: async (tierId: number): Promise<ApiResponse<MembershipTier>> => {
        const response = await apiClient.get<ApiResponse<MembershipTier>>(`/memberships/tiers/${tierId}`);
        return response.data;
    },

    // Get all memberships for the current user
    getUserMemberships: async (): Promise<ApiResponse<Membership[]>> => {
        const response = await apiClient.get<ApiResponse<Membership[]>>('/memberships/user');
        return response.data;
    },

    // Get all members for a channel (if you're the channel owner)
    getChannelMembers: async (channelId: number): Promise<ApiResponse<Membership[]>> => {
        const response = await apiClient.get<ApiResponse<Membership[]>>(`/memberships/channel/${channelId}`);
        return response.data;
    },

    // Check if user has an active membership for a channel
    checkMembership: async (channelId: number): Promise<ApiResponse<boolean>> => {
        const response = await apiClient.get<ApiResponse<boolean>>('/memberships/check', {
            params: { channelId }
        });
        return response.data;
    },

    // Create a PayPal payment for a membership tier
    createPayment: async (membershipTierId: number): Promise<ApiResponse<CreatePaymentResponse>> => {
        const response = await apiClient.post<ApiResponse<CreatePaymentResponse>>('/payments/create', null, {
            params: { membershipTierId }
        });
        return response.data;
    },

    // Capture a payment after PayPal approval
    capturePayment: async (paymentId: string, PayerID: string): Promise<ApiResponse<PaymentCaptureResponse>> => {
        const response = await apiClient.post<ApiResponse<PaymentCaptureResponse>>('/payments/capture', {
             paymentId, payerID: PayerID 
        });
        return response.data;
    },

    // Cancel a payment
    cancelPayment: async (paymentId: string): Promise<ApiResponse<void>> => {
        const response = await apiClient.get<ApiResponse<void>>('/payments/cancel', {
            params: { paymentId }
        });
        return response.data;
    }
};

export default MembershipService;