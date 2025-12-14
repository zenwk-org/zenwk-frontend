import { Suspense } from 'react';
import LoginForm from '@/components/modules/auth/forms/LoginForm';
import Spinner from '@/components/shared/ui/Spinner';

export default function LoginPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <LoginForm />
        </Suspense>
    );
}
