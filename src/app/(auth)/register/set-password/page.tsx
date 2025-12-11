import { Suspense } from 'react';
import SetPassword from '../../../../../components/modules/auth/forms/SetPasswordForm';
import Spinner from '@app/shared/ui/Spinner';

export default function OptPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <SetPassword />
        </Suspense>
    );
}
