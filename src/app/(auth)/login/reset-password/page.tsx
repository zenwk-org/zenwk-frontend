import { Suspense } from 'react';
import ResetPasswordForm from '@/components/modules/auth/forms/ResetPasswordForm';
import Spinner from '@/components/shared/ui/Spinner';

export default function LoginPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <ResetPasswordForm />
        </Suspense>
    );
}
