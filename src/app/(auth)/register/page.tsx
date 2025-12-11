import { Suspense } from 'react';
import Register from '../../../../components/modules/auth/forms/RegisterForm';
import Spinner from '@app/shared/ui/Spinner';

export default function RegisterPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <Register />
        </Suspense>
    );
}
