'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import useMemberships from '@/lib/hooks/use-memberships';
import { useAuthStore } from '@/store/auth-store';

export default function PaymentCancelPage() {
    const { isAuthenticated } = useAuthStore();
    const { cancelPayment } = useMemberships();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get payment ID from URL
    const paymentId = searchParams.get('paymentId');

    // Cancel the payment
    useEffect(() => {
        const handleCancel = async () => {
            if (!isAuthenticated) {
                router.push('/login');
                return;
            }

            if (paymentId) {
                try {
                    await cancelPayment(paymentId);
                } catch (error) {
                    console.error('Error cancelling payment:', error);
                }
            }
        };

        handleCancel();
    }, [isAuthenticated, paymentId, router, cancelPayment]);

    // Redirect if not authenticated
    if (!isAuthenticated) {
        return null; // Will redirect in the useEffect
    }

    return (
        <div className="container max-w-md mx-auto py-16">
            <Card>
                <CardHeader className="text-center pb-2">
                    <XCircle className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                    <CardTitle className="text-xl">Payment Cancelled</CardTitle>
                    <CardDescription>
                        You've decided not to complete the payment
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="mb-4">
                        Your membership subscription has been cancelled. No payment has been processed
                        and no charges have been made to your account.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button asChild>
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Return to Home
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}