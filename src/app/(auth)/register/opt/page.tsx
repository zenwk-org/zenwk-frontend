import { Suspense } from 'react';
import Opt from '../../../../../components/modules/auth/forms/OptForm';
import Spinner from '@app/shared/ui/Spinner';

export default function OptPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <Opt />
        </Suspense>
    );
}
