import { Suspense } from 'react';
import SetPasswordForm from '@/components/modules/auth/forms/SetPasswordForm';
import Spinner from '@/components/shared/ui/Spinner';
import { Metadata } from 'next';
import { AuthMessages } from '@/lib/modules/auth/constants/auth-messages';

export const metadata: Metadata = {
    title: AuthMessages.setPassword.title,
};
export default function OptPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <SetPasswordForm />
        </Suspense>
    );
}
