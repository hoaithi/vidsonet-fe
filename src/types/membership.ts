import { User } from './user';

export interface MembershipTier {
    id: number;
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
    id: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    tier: MembershipTier;
    subscriber: User;
    channel: User;
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