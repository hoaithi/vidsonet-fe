

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import useMemberships from '@/lib/hooks/use-memberships';
import { useAuthStore } from '@/store/auth-store';
import MembershipService from '@/services/membership-service';

export default function PaymentSuccessPage() {
    const { isAuthenticated } = useAuthStore();
    const { handlePayPalReturn } = useMemberships();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [channelId, setChannelId] = useState<number | null>(null);
    const [channelName, setChannelName] = useState<string>('');

    // Get params from URL
    const paymentId = searchParams.get('token');
    const PayerID = searchParams.get('PayerID');
    const tierId = searchParams.get('tier_id');

    // Process the payment
    useEffect(() => {
        const processPayment = async () => {
            console.log('Processing payment with ID:', paymentId, 'and PayerID:', PayerID);
            if (!isAuthenticated) {
                router.push('/login');
                return;
            }

            if (!paymentId || !PayerID) {
                setIsProcessing(false);
                return;
            }

            try {
                const result = await handlePayPalReturn(paymentId, PayerID);
                setIsSuccess(result);

                // Get channel ID from tier if payment was successful
                if (result && tierId) {
                    try {
                        const tierResponse = await MembershipService.getMembershipTierById(parseInt(tierId));
                        if (tierResponse.result) {
                            setChannelId(tierResponse.result.channelId);
                            setChannelName(tierResponse.result.channelName);
                        }
                    } catch (tierError) {
                        console.error('Error fetching tier information:', tierError);
                        // Even if we can't get tier info, payment was successful, so continue
                    }
                }
            } catch (error) {
                console.error('Error processing payment:', error);
                setIsSuccess(false);
            } finally {
                setIsProcessing(false);
            }
        };

        processPayment();
    }, [isAuthenticated, paymentId, PayerID, tierId, router, handlePayPalReturn]);

    // Redirect if not authenticated
    if (!isAuthenticated) {
        return null; // Will redirect in the useEffect
    }

    return (
        <div className="container max-w-md mx-auto py-16">
            <Card>
                {isProcessing ? (
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
                        <p className="text-muted-foreground">
                            Please wait while we confirm your membership...
                        </p>
                    </CardContent>
                ) : isSuccess ? (
                    <>
                        <CardHeader className="text-center pb-2">
                            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-2" />
                            <CardTitle className="text-xl">Payment Successful!</CardTitle>
                            <CardDescription>
                                {channelName 
                                    ? `Thank you for becoming a member of ${channelName}`
                                    : 'Thank you for becoming a member'
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="mb-4">
                                Your membership has been activated. You now have access to premium
                                content and other exclusive benefits.
                            </p>
                            {channelName && (
                                <p className="text-sm text-muted-foreground">
                                    You can now enjoy premium content from {channelName}.
                                </p>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-center space-x-2">
                            {channelId ? (
                                <>
                                    <Button asChild>
                                        <Link href={`/channel/${channelId}`}>
                                            View Channel
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href="/">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Go to Home
                                        </Link>
                                    </Button>
                                </>
                            ) : (
                                <Button asChild>
                                    <Link href="/">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Go to Home Page
                                    </Link>
                                </Button>
                            )}
                        </CardFooter>
                    </>
                ) : (
                    <>
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-xl">Payment Not Completed</CardTitle>
                            <CardDescription>
                                There was an issue with your payment
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="mb-4">
                                We couldn't process your payment successfully. No charges have been made.
                                Please try again or contact support if the issue persists.
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Button asChild variant="outline">
                                <Link href="/">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Return to Home
                                </Link>
                            </Button>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    );
}