import { Profile } from './profile';

export interface MembershipTier {
    id: string;
    name: string;
    description?: string;
    price: number;
    durationMonths: number;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    channelId: number;
    channelName: string;
}

export interface Membership {
    id: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    tier: MembershipTier;
    subscriber: Profile;
    channel: Profile;
}

export interface MembershipTierCreateRequest {
    name: string;
    description?: string;
    price: number;
    durationMonths: number;
}

export interface MembershipTierUpdateRequest {
    name?: string;
    description?: string;
    price?: number;
    durationMonths?: number;
    isActive?: boolean;
}

export interface CreatePaymentResponse {
    paymentId: string;
    approvalUrl: string;
    membershipId: number;
}

export interface PaymentCaptureResponse {
    success: boolean;
    paymentId: string;
    transactionId: string;
    membershipId: number;
    message: string;
}