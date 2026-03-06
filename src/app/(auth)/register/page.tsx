import { Suspense } from 'react';
import RegisterForm from '@/components/modules/auth/forms/RegisterForm';
import Spinner from '@/components/shared/ui/Spinner';
import { Metadata } from 'next';
import { AuthMessages } from '@/lib/modules/auth/constants/auth-messages';

export const metadata: Metadata = {
    title: AuthMessages.register.title,
};

export default function RegisterPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <RegisterForm />
        </Suspense>
    );
}
