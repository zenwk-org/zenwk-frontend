import React from 'react';
import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from '@testing-library/react';

import SetPasswordUser from '@/components/modules/auth/common/SetPasswordUser';
import { useSearchParams, useRouter } from 'next/navigation';
import { isClientErrorMessage } from '@/lib/shared/utils/fetchApi';

// -------------------------
// Mocks base
// -------------------------
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

let capturedSetLoading: jest.Mock;

jest.mock('@/hooks/modules/auth/useRedirectRegister', () => {
    return jest.fn((email, uuid, setLoading, isResetPassword) => {
        capturedSetLoading = setLoading;
        return {
            loading: false,
            setLoading: setLoading,
        };
    });
});

jest.mock('@/lib/shared/utils/fetchApi', () => ({
    isClientErrorMessage: jest.fn(),
}));

jest.mock('@/components/shared/ui/Spinner', () => () => (
    <div>loading-spinner</div>
));

jest.mock('@/components/shared/ui/FormError', () => ({ error }: any) => (
    <div data-testid="form-error">
        {typeof error === 'string' ? error : 'complex'}
    </div>
));

jest.mock('@/components/ui/inputs/InputText', () => {
    const actualReact = require('react');
    return actualReact.forwardRef(
        (
            {
                isError,
                children,
                text,
                minWidth,
                variant,
                fullWidth,
                sizeText,
                inputClass,
                sizeTextInput,
                ...rest
            }: any,
            ref: React.ForwardedRef<HTMLInputElement>
        ) => <input data-testid={text} ref={ref} {...rest} />
    );
});

jest.mock('@/components/ui/auth/InputDisabled', () => ({ text }: any) => (
    <div data-testid="input-disabled">{text}</div>
));

jest.mock(
    '@/components/modules/auth/common/LoadButton',
    () =>
        ({ textButton }: any) => <button type="submit">{textButton}</button>
);

jest.mock('@/components/shared/common/AlertInfo', () => ({ children }: any) => (
    <div data-testid="alert-info">{children}</div>
));

jest.mock('@/components/shared/common/Text', () => (props: any) => (
    <div>{props.text}</div>
));

jest.mock(
    '@/components/modules/auth/common/HeaderAction',
    () =>
        ({ title, message }: any) => (
            <>
                <h1>{title}</h1>
                <div>{message}</div>
            </>
        )
);

// Timers
jest.useFakeTimers();

const simulateLoadComplete = () => {
    act(() => {
        if (capturedSetLoading) {
            capturedSetLoading(false);
        }
    });
};

describe('SetPasswordUser Component', () => {
    const pushMock = jest.fn();
    const onSubmitPasswordMock = jest.fn();

    const createMocks = ({
        email = 'test@mail.com',
        uuid = '123',
        code = 'ABC',
    } = {}) => {
        (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

        (useSearchParams as jest.Mock).mockReturnValue({
            get: (key: string) => {
                if (key === 'email') return email;
                if (key === 'uuid') return uuid;
                if (key === 'code') return code;
                return null;
            },
        });
    };

    beforeEach(() => {
        jest.clearAllMocks();
        capturedSetLoading = jest.fn();
    });

    it('should render spinner while loading', () => {
        createMocks();

        render(
            <SetPasswordUser
                title="Cambiar Password"
                headerText="header"
                buttonText="Guardar"
                onSubmitPassword={onSubmitPasswordMock}
            />
        );

        expect(screen.getByText('loading-spinner')).toBeInTheDocument();
    });

    it('should render form when loading = false', () => {
        createMocks();

        render(
            <SetPasswordUser
                title="Cambiar Password"
                headerText="header"
                buttonText="Guardar"
                onSubmitPassword={onSubmitPasswordMock}
                isResetPassword={false}
            />
        );

        simulateLoadComplete();

        expect(screen.getByText('Cambiar Password')).toBeInTheDocument();
        expect(screen.getByTestId('input-disabled')).toHaveTextContent(
            'test@mail.com'
        );
    });

    it('should call onSubmitPassword on success', async () => {
        createMocks();

        render(
            <SetPasswordUser
                title="Cambiar Password"
                headerText="header"
                buttonText="Guardar"
                onSubmitPassword={onSubmitPasswordMock}
            />
        );

        simulateLoadComplete();

        fireEvent.change(screen.getByTestId('password'), {
            target: { value: 'A1a!aaaa' },
        });
        fireEvent.change(screen.getByTestId('repeat password'), {
            target: { value: 'A1a!aaaa' },
        });

        fireEvent.click(screen.getByText('Guardar'));

        await waitFor(() =>
            expect(onSubmitPasswordMock).toHaveBeenCalledWith(
                'test@mail.com',
                'A1a!aaaa',
                '123',
                'ABC'
            )
        );
    });

    it('should display root error when backend returns generic error', async () => {
        createMocks();

        const isClientErrorMessageMock =
            isClientErrorMessage as jest.MockedFunction<
                typeof isClientErrorMessage
            >;

        isClientErrorMessageMock.mockReturnValue(true);
        onSubmitPasswordMock.mockRejectedValue({
            code: 'GENERIC_ERR',
            message: 'Error genérico',
        });

        render(
            <SetPasswordUser
                title="Cambiar Password"
                headerText="header"
                buttonText="Guardar"
                onSubmitPassword={onSubmitPasswordMock}
            />
        );

        simulateLoadComplete();

        fireEvent.change(screen.getByTestId('password'), {
            target: { value: 'A1a!aaaa' },
        });
        fireEvent.change(screen.getByTestId('repeat password'), {
            target: { value: 'A1a!aaaa' },
        });

        fireEvent.click(screen.getByText('Guardar'));

        await waitFor(() =>
            expect(screen.getByTestId('form-error')).toBeInTheDocument()
        );
    });

    it('should show countdown and redirect when token expired', async () => {
        createMocks();

        const isClientErrorMessageMock =
            isClientErrorMessage as jest.MockedFunction<
                typeof isClientErrorMessage
            >;

        isClientErrorMessageMock.mockReturnValue(true);

        onSubmitPasswordMock.mockRejectedValue({
            code: 'FUNC_SEC_AUTH_0004',
            message: 'Token expirado',
        });

        render(
            <SetPasswordUser
                title="Cambiar Password"
                headerText="header"
                buttonText="Guardar"
                onSubmitPassword={onSubmitPasswordMock}
            />
        );

        simulateLoadComplete();

        fireEvent.change(screen.getByTestId('password'), {
            target: { value: 'A1a!aaaa' },
        });
        fireEvent.change(screen.getByTestId('repeat password'), {
            target: { value: 'A1a!aaaa' },
        });

        fireEvent.click(screen.getByText('Guardar'));

        await waitFor(() =>
            expect(screen.getByTestId('alert-info')).toBeInTheDocument()
        );

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(pushMock).toHaveBeenCalledWith(
            '/forgot-password?email=test%40mail.com'
        );
    });
});
