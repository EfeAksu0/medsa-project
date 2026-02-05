import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');
    const next = searchParams.get('next') || '/dashboard';
    const plan = searchParams.get('plan'); // Preserve plan parameter from registration

    if (token_hash && type) {
        try {
            // Verify the magic link token
            const { data, error } = await supabase.auth.verifyOtp({
                token_hash,
                type: type as any,
            });

            if (error) {
                console.error('Magic link verification error:', error);
                return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url));
            }

            if (data.session) {
                // Sync user to backend database
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/sync-supabase-user`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${data.session.access_token}`
                        },
                        body: JSON.stringify({
                            email: data.session.user.email,
                            name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0]
                        })
                    });

                    if (!response.ok) {
                        console.error('Failed to sync user to backend');
                    }
                } catch (syncErr) {
                    console.error('Error syncing user:', syncErr);
                }

                // Mark email as verified in backend
                try {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/mark-email-verified`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${data.session.access_token}`
                        }
                    });
                } catch (verifyErr) {
                    console.error('Error marking email verified:', verifyErr);
                }

                // If plan parameter exists, redirect to payment
                if (plan) {
                    try {
                        const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/payments/create-checkout-session`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${data.session.access_token}`
                            },
                            body: JSON.stringify({ planId: plan })
                        });

                        const paymentData = await paymentResponse.json();

                        if (paymentData.url) {
                            return NextResponse.redirect(paymentData.url);
                        }
                    } catch (payErr) {
                        console.error('Payment error:', payErr);
                        // Continue to dashboard if payment fails
                    }
                }

                // Redirect to dashboard with session token
                const redirectUrl = new URL(next, request.url);
                redirectUrl.searchParams.set('token', data.session.access_token);
                return NextResponse.redirect(redirectUrl);
            }
        } catch (err) {
            console.error('Callback error:', err);
            return NextResponse.redirect(new URL('/login?error=verification_failed', request.url));
        }
    }

    // No token_hash, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
}
