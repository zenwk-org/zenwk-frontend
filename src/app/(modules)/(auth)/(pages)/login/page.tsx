import { Suspense } from 'react';
import Login from './Login';
import Spinner from '@app/shared/ui/Spinner';

export default function LoginPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <Login />
        </Suspense>
    );
}
