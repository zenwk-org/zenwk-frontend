import { Suspense } from 'react';
import ForgotPasswordForm from '@/components/modules/auth/forms/ForgotPasswordForm';
import Spinner from '@/components/shared/ui/Spinner';
import { Metadata } from 'next';
import { AuthMessages } from '@/lib/modules/auth/constants/auth-messages';

export const metadata: Metadata = {
    title: AuthMessages.forgotPassword.title,
};

export default function LoginPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <ForgotPasswordForm />
        </Suspense>
    );
}
