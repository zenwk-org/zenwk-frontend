import { Suspense } from 'react';
import ForgotPasswordForm from '@/components/modules/auth/forms/ForgotPasswordForm';
import Spinner from '@/components/shared/ui/Spinner';

export default function LoginPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <ForgotPasswordForm />
        </Suspense>
    );
}
