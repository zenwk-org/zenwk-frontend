import { Suspense } from 'react';
import LoginForm from '@/components/modules/auth/forms/LoginForm';
import Spinner from '@/components/shared/ui/Spinner';
import { Metadata } from 'next';
import { AuthMessages } from '@/lib/modules/auth/constants/auth-messages';

export const metadata: Metadata = {
    title: AuthMessages.login.title,
};

export default function LoginPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <LoginForm />
        </Suspense>
    );
}
