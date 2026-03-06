import { Suspense } from 'react';
import OptForm from '@/components/modules/auth/forms/OptForm';
import Spinner from '@/components/shared/ui/Spinner';
import { Metadata } from 'next';
import { AuthMessages } from '@/lib/modules/auth/constants/auth-messages';

export const metadata: Metadata = {
    title: AuthMessages.otp.title,
};
export default function OptPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <OptForm />
        </Suspense>
    );
}
