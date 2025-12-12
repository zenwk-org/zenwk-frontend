import { Suspense } from 'react';
import SetPasswordForm from '@/components/modules/auth/forms/SetPasswordForm';
import Spinner from '@/components/shared/ui/Spinner';

export default function OptPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <SetPasswordForm />
        </Suspense>
    );
}
