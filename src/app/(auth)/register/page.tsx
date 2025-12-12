import { Suspense } from 'react';
import RegisterForm from '@/components/modules/auth/forms/RegisterForm';
import Spinner from '@/components/shared/ui/Spinner';

export default function RegisterPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <RegisterForm />
        </Suspense>
    );
}
