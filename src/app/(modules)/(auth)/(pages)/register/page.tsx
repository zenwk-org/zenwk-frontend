import { Suspense } from 'react';
import Register from './Register';
import Spinner from '@app/shared/ui/Spinner';

export default function RegisterPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <Register />
        </Suspense>
    );
}
