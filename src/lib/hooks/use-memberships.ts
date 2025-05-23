import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import MembershipService from '@/services/membership-service';
import {
    MembershipTier,
    Membership,
    MembershipTierCreateRequest,
    MembershipTierUpdateRequest
} from '@/types/membership';

export const useMemberships = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>([]);
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [isMember, setIsMember] = useState(false);
    const router = useRouter();

    // Get membership tiers for a channel
    const getChannelMembershipTiers = async (channelId: number) => {
        setIsLoading(true);

        try {
            const response = await MembershipService.getChannelMembershipTiers(channelId);

            if (response.data) {
                console.log("membership tier data ", response.data)
                setMembershipTiers(response.data);
            }

            return response.data || [];
        } catch (error: any) {
            console.error('Error fetching membership tiers:', error);

            toast.error(
                error.response?.data?.message ||
                'Failed to load membership tiers. Please try again.'
            );
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Create a new membership tier
    const createMembershipTier = async (data: MembershipTierCreateRequest) => {
        setIsLoading(true);

        try {
            const response = await MembershipService.createMembershipTier(data);

            if (response.data) {
                setMembershipTiers(prev => [...prev, response.data as MembershipTier]);
                toast.success('Membership tier created successfully');
            }

            return response.data;
        } catch (error: any) {
            console.error('Error creating membership tier:', error);

            toast.error(
                error.response?.data?.message ||
                'Failed to create membership tier. Please try again.'
            );
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Update a membership tier
    const updateMembershipTier = async (tierId: number, data: MembershipTierUpdateRequest) => {
        setIsLoading(true);

        try {
            const response = await MembershipService.updateMembershipTier(tierId, data);

            if (response.data) {
                setMembershipTiers(prev =>
                    prev.map(tier => tier.id === tierId ? response.data as MembershipTier : tier)
                );
                toast.success('Membership tier updated successfully');
            }

            return response.data;
        } catch (error: any) {
            console.error('Error updating membership tier:', error);

            toast.error(
                error.response?.data?.message ||
                'Failed to update membership tier. Please try again.'
            );
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Delete a membership tier
    const deleteMembershipTier = async (tierId: number) => {
        setIsLoading(true);

        try {
            await MembershipService.deleteMembershipTier(tierId);

            setMembershipTiers(prev => prev.filter(tier => tier.id !== tierId));
            toast.success('Membership tier deleted successfully');
            return true;
        } catch (error: any) {
            console.error('Error deleting membership tier:', error);

            toast.error(
                error.response?.data?.message ||
                'Failed to delete membership tier. Please try again.'
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Get user memberships
    const getUserMemberships = async () => {
        setIsLoading(true);

        try {
            const response = await MembershipService.getUserMemberships();

            if (response.data) {
                setMemberships(response.data);
            }

            return response.data || [];
        } catch (error: any) {
            console.error('Error fetching user memberships:', error);

            toast.error(
                error.response?.data?.message ||
                'Failed to load your memberships. Please try again.'
            );
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Get channel members
    const getChannelMembers = async (channelId: number) => {
        setIsLoading(true);

        try {
            const response = await MembershipService.getChannelMembers(channelId);

            if (response.data) {
                setMemberships(response.data);
            }

            return response.data || [];
        } catch (error: any) {
            console.error('Error fetching channel members:', error);

            toast.error(
                error.response?.data?.message ||
                'Failed to load channel members. Please try again.'
            );
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Check if user is a member of a channel
    const checkChannelMembership = async (channelId: number) => {
        try {
            const response = await MembershipService.checkMembership(channelId);

            if (response.data !== undefined) {
                setIsMember(response.data);
            }

            return response.data || false;
        } catch (error: any) {
            console.error('Error checking membership:', error);
            return false;
        }
    };

    // Subscribe to a membership tier
    const subscribeToTier = async (tierId: number) => {
        setIsLoading(true);

        try {
            const response = await MembershipService.createPayment(tierId);

            if (response.data && response.data.approvalUrl) {
                // Redirect to PayPal approval page
                window.location.href = response.data.approvalUrl;
                return true;
            } else {
                toast.error('Failed to create payment. Please try again.');
                return false;
            }
        } catch (error: any) {
            console.error('Error creating payment:', error);

            toast.error(
                error.response?.data?.message ||
                'Failed to start subscription process. Please try again.'
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Handle PayPal return after payment approval
    const handlePayPalReturn = async (paymentId: string, PayerID: string) => {
        setIsLoading(true);

        try {
            const response = await MembershipService.capturePayment(paymentId, PayerID);

            if (response.data && response.data.success) {
                toast.success('Payment completed successfully! You are now a member.');
                return true;
            } else {
                toast.error('Payment failed. Please try again.');
                return false;
            }
        } catch (error: any) {
            console.error('Error capturing payment:', error);

            toast.error(
                error.response?.data?.message ||
                'Failed to complete payment. Please try again.'
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Cancel payment
    const cancelPayment = async (paymentId: string) => {
        try {
            await MembershipService.cancelPayment(paymentId);
            toast.info('Payment cancelled');
            return true;
        } catch (error: any) {
            console.error('Error cancelling payment:', error);
            return false;
        }
    };

    return {
        isLoading,
        membershipTiers,
        memberships,
        isMember,
        getChannelMembershipTiers,
        createMembershipTier,
        updateMembershipTier,
        deleteMembershipTier,
        getUserMemberships,
        getChannelMembers,
        checkChannelMembership,
        subscribeToTier,
        handlePayPalReturn,
        cancelPayment,
    };
};

export default useMemberships;