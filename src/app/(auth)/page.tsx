import { Suspense } from 'react';
import ForgotPassword from '../../../components/modules/auth/forms/ForgotPasswordForm';
import Spinner from '@app/shared/ui/Spinner';

export default function LoginPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <ForgotPassword />
        </Suspense>
    );
}
