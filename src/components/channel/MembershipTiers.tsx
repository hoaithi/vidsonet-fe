'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    Crown,
    Plus,
    Edit,
    Trash2,
    Check,
    X,
    Loader2,
    AlertTriangle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { useAuthStore } from '@/store/auth-store';
import { useMemberships } from '@/lib/hooks/use-memberships';
import { MembershipTier, MembershipTierCreateRequest, MembershipTierUpdateRequest } from '@/types/membership';

interface MembershipTiersProps {
    channelId: number;
    isOwnChannel: boolean;
}

export function MembershipTiers({ channelId, isOwnChannel }: MembershipTiersProps) {
    const { isAuthenticated, user } = useAuthStore();
    const {
        isLoading,
        membershipTiers,
        getChannelMembershipTiers,
        createMembershipTier,
        updateMembershipTier,
        deleteMembershipTier,
        checkChannelMembership,
        subscribeToTier,
        isMember
    } = useMemberships();

    const [isCreating, setIsCreating] = useState(false);
    const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form states
    const [tierName, setTierName] = useState('');
    const [tierDescription, setTierDescription] = useState('');
    const [tierPrice, setTierPrice] = useState('');
    const [tierDuration, setTierDuration] = useState('1');
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    // Load membership tiers
    useEffect(() => {
        getChannelMembershipTiers(channelId);

        if (isAuthenticated && !isOwnChannel) {
            checkChannelMembership(channelId);
        }
    }, [channelId, isAuthenticated, isOwnChannel]);

    // Reset form fields
    const resetForm = () => {
        setTierName('');
        setTierDescription('');
        setTierPrice('');
        setTierDuration('1');
        setFormErrors({});
    };

    // Set form fields for editing
    const setupEditForm = (tier: MembershipTier) => {
        setTierName(tier.name);
        setTierDescription(tier.description || '');
        setTierPrice(tier.price.toString());
        setTierDuration(tier.durationMonths.toString());
        setSelectedTier(tier);
        setIsEditing(true);
    };

    // Validate form
    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!tierName.trim()) {
            errors.name = 'Name is required';
        }

        if (!tierPrice.trim() || isNaN(parseFloat(tierPrice)) || parseFloat(tierPrice) <= 0) {
            errors.price = 'Price must be a positive number';
        }

        if (!tierDuration.trim() || isNaN(parseInt(tierDuration)) || parseInt(tierDuration) < 1) {
            errors.duration = 'Duration must be at least 1 month';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle create tier
    const handleCreateTier = async () => {
        if (!validateForm()) return;

        const tierData: MembershipTierCreateRequest = {
            name: tierName,
            description: tierDescription || undefined,
            price: parseFloat(tierPrice),
            durationMonths: parseInt(tierDuration)
        };

        const success = await createMembershipTier(tierData);

        if (success) {
            resetForm();
            setIsCreating(false);
        }
    };

    // Handle update tier
    const handleUpdateTier = async () => {
        if (!selectedTier || !validateForm()) return;

        const tierData: MembershipTierUpdateRequest = {
            name: tierName,
            description: tierDescription || undefined,
            price: parseFloat(tierPrice),
            durationMonths: parseInt(tierDuration)
        };

        const success = await updateMembershipTier(selectedTier.id, tierData);

        if (success) {
            resetForm();
            setIsEditing(false);
            setSelectedTier(null);
        }
    };

    // Handle delete tier
    const handleDeleteTier = async () => {
        if (!selectedTier) return;

        const success = await deleteMembershipTier(selectedTier.id);

        if (success) {
            setIsDeleting(false);
            setSelectedTier(null);
        }
    };

    // Handle subscribe
    const handleSubscribe = async (tierId: number) => {
        if (!isAuthenticated) {
            toast.error('Please sign in to subscribe');
            return;
        }

        await subscribeToTier(tierId);
    };

    // Render create/edit tier dialog
    const renderTierDialog = () => {
        const title = isEditing ? 'Edit Membership Tier' : 'Create Membership Tier';
        const action = isEditing ? 'Save Changes' : 'Create Tier';

        return (
            <Dialog open={isCreating || isEditing} onOpenChange={(open) => {
                if (!open) {
                    setIsCreating(false);
                    setIsEditing(false);
                    resetForm();
                }
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            Define the benefits, price, and duration for this membership tier.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="name" className="text-sm font-medium">Name *</label>
                            <Input
                                id="name"
                                value={tierName}
                                onChange={(e) => setTierName(e.target.value)}
                                placeholder="Gold Tier"
                                className={formErrors.name ? "border-destructive" : ""}
                            />
                            {formErrors.name && (
                                <p className="text-sm text-destructive">{formErrors.name}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="description" className="text-sm font-medium">Description</label>
                            <Textarea
                                id="description"
                                value={tierDescription}
                                onChange={(e) => setTierDescription(e.target.value)}
                                placeholder="Access to exclusive content, early releases, and more."
                                className="min-h-24"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="price" className="text-sm font-medium">Price (USD) *</label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={tierPrice}
                                    onChange={(e) => setTierPrice(e.target.value)}
                                    placeholder="9.99"
                                    className={formErrors.price ? "border-destructive" : ""}
                                />
                                {formErrors.price && (
                                    <p className="text-sm text-destructive">{formErrors.price}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="duration" className="text-sm font-medium">Duration (months) *</label>
                                <Input
                                    id="duration"
                                    type="number"
                                    min="1"
                                    value={tierDuration}
                                    onChange={(e) => setTierDuration(e.target.value)}
                                    placeholder="1"
                                    className={formErrors.duration ? "border-destructive" : ""}
                                />
                                {formErrors.duration && (
                                    <p className="text-sm text-destructive">{formErrors.duration}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => {
                            setIsCreating(false);
                            setIsEditing(false);
                            resetForm();
                        }}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={isEditing ? handleUpdateTier : handleCreateTier}>
                            {action}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    // Delete confirmation dialog
    const renderDeleteDialog = () => {
        return (
            <AlertDialog open={isDeleting} onOpenChange={(open) => {
                if (!open) {
                    setIsDeleting(false);
                    setSelectedTier(null);
                }
            }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Membership Tier</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this membership tier? This action cannot be undone.
                            {selectedTier?.isActive && (
                                <div className="mt-2">
                                    <AlertTriangle className="h-4 w-4 inline mr-1 text-amber-500" />
                                    <span className="text-amber-500 font-medium">
                                        This tier has active subscribers who will lose their benefits.
                                    </span>
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteTier} className="bg-destructive">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    };

    if (isLoading && membershipTiers.length === 0) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Crown className="h-5 w-5 text-amber-500" />
                        Membership Tiers
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Support this channel and get exclusive benefits
                    </p>
                </div>

                {isOwnChannel && (
                    <Button onClick={() => setIsCreating(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Tier
                    </Button>
                )}
            </div>

            {membershipTiers.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        {isOwnChannel ? (
                            <div>
                                <h4 className="text-lg font-medium mb-2">No Membership Tiers Yet</h4>
                                <p className="text-muted-foreground mb-4">
                                    Create membership tiers to offer exclusive benefits to your subscribers!
                                </p>
                                <Button onClick={() => setIsCreating(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Your First Tier
                                </Button>
                            </div>
                        ) : (
                            <p className="text-muted-foreground">
                                This channel doesn't have any membership tiers yet.
                            </p>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {membershipTiers
                        .filter(tier => tier.isActive || isOwnChannel)
                        .sort((a, b) => a.price - b.price)
                        .map((tier) => (
                            <Card key={tier.id} className={tier.isActive ? '' : 'opacity-60'}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                {tier.name}
                                                {!tier.isActive && (
                                                    <Badge variant="outline" className="ml-2 text-muted-foreground">
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                            <CardDescription>
                                                {tier.durationMonths} {tier.durationMonths === 1 ? 'month' : 'months'}
                                            </CardDescription>
                                        </div>

                                        {isOwnChannel && (
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setupEditForm(tier)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedTier(tier);
                                                        setIsDeleting(true);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold mb-4">
                                        ${tier.price.toFixed(2)}
                                    </div>

                                    {tier.description && (
                                        <p className="text-sm text-muted-foreground mb-6">
                                            {tier.description}
                                        </p>
                                    )}

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">Access to premium videos</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">Member-only community posts</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">Special member badge</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    {isOwnChannel ? (
                                        <div className="w-full">
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {tier.isActive ? 'This tier is active and available to subscribers' : 'This tier is not visible to subscribers'}
                                            </p>
                                            <Button
                                                variant={tier.isActive ? "outline" : "default"}
                                                className="w-full"
                                                onClick={() => {
                                                    updateMembershipTier(tier.id, { isActive: !tier.isActive });
                                                }}
                                            >
                                                {tier.isActive ? 'Deactivate Tier' : 'Activate Tier'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            className="w-full"
                                            onClick={() => handleSubscribe(tier.id)}
                                            disabled={isMember || !isAuthenticated}
                                        >
                                            {isMember ? 'Already a Member' : 'Join Membership'}
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                </div>
            )}

            {/* Member status alert */}
            {!isOwnChannel && isAuthenticated && isMember && (
                <Alert className="mt-4 border-green-500">
                    <Check className="h-4 w-4 text-green-500" />
                    <AlertTitle>You're a member!</AlertTitle>
                    <AlertDescription>
                        You have an active membership to this channel. Enjoy your premium benefits!
                    </AlertDescription>
                </Alert>
            )}

            {/* Dialogs */}
            {renderTierDialog()}
            {renderDeleteDialog()}
        </div>
    );
}