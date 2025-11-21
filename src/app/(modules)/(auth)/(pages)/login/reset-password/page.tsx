import { Suspense } from 'react';
import ResetPassword from './ResetPassword';
import Spinner from '@app/shared/ui/Spinner';

export default function LoginPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <ResetPassword />
        </Suspense>
    );
}
