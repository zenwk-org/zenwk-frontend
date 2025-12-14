import { Suspense } from 'react';
import OptForm from '@/components/modules/auth/forms/OptForm';
import Spinner from '@/components/shared/ui/Spinner';

export default function OptPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <OptForm />
        </Suspense>
    );
}
