import React from 'react';
import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from '@testing-library/react';

import SetPasswordUser from '@app/app/(auth)/components/SetPasswordUser';
import { useSearchParams, useRouter } from 'next/navigation';
import { isClientErrorMessage } from '@app/helpers/fetch-api';

// -------------------------
// Mocks base
// -------------------------
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

// Declare a variable to capture the setLoading function passed by the component
let capturedSetLoading: jest.Mock;

// Mock the hook to capture the internal state setter
jest.mock('@auth/hooks/useRedirectRegister', () => {
    // The component passes its `useState` setter (setLoading) as the 3rd argument.
    return jest.fn((email, uuid, setLoading, isResetPassword) => {
        // Capture the setLoading function for use in the tests
        capturedSetLoading = setLoading;
        // Return a mock object (though the component primarily uses the passed setter)
        return {
            loading: false,
            setLoading: setLoading,
        };
    });
});

jest.mock('@app/helpers/fetch-api', () => ({
    isClientErrorMessage: jest.fn(),
}));

jest.mock('@app/shared/ui/Spinner', () => () => <div>loading-spinner</div>);

jest.mock('@app/shared/ui/FormError', () => ({ error }: any) => (
    <div data-testid="form-error">
        {typeof error === 'string' ? error : 'complex'}
    </div>
));

jest.mock('@user/ui/inputs/InputText', () => {
    // Usamos require('react') para acceder a React de forma segura dentro del factory
    const actualReact = require('react');
    // Definimos una función que acepta todas las props
    return actualReact.forwardRef(
        (
            {
                // Desestructuramos y filtramos TODAS las props personalizadas
                isError,
                children, // Se queda dentro para que no se pase al input nativo
                text, // Se queda dentro
                minWidth,
                variant,
                fullWidth,
                sizeText,
                inputClass,
                sizeTextInput,
                // Capturamos el resto (debe ser ref y props nativas de HTML)
                ...rest
            }: any,
            ref: React.ForwardedRef<HTMLInputElement>
        ) => (
            // Pasamos SÓLO 'rest' (que contiene las props nativas) y la prop 'text' para el testid
            // El ref es importante para que react-hook-form funcione en el test
            <input data-testid={text} ref={ref} {...rest} />
        )
    );
});

jest.mock(
    '@app/app/(modules)/(auth)/ui/InputDisabled',
    () =>
        ({ text }: any) => <div data-testid="input-disabled">{text}</div>
);

jest.mock('@auth/components/LoadButton', () => ({ textButton }: any) => (
    <button type="submit">{textButton}</button>
));

jest.mock('@app/shared/components/AlertInfo', () => ({ children }: any) => (
    <div data-testid="alert-info">{children}</div>
));

jest.mock('@user/ui/user-feed/Text', () => (props: any) => (
    <div>{props.text}</div>
));

jest.mock('@auth/components/HeaderAction', () => ({ title, message }: any) => (
    <>
        <h1>{title}</h1>
        <div>{message}</div>
    </>
));

// Timers
jest.useFakeTimers();

// Utility function to simulate the hook resolving the loading state
const simulateLoadComplete = () => {
    // State updates must be wrapped in `act` to ensure the component re-renders
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
        // Reset the captured setLoading function for each test
        capturedSetLoading = jest.fn();
    });

    it('should render spinner while loading', () => {
        createMocks();

        // The component's internal state starts at `true`, so this should correctly show the spinner on first render.
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

        // Simulate the hook setting the internal state to false
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

        simulateLoadComplete(); // Ensure the form is rendered

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

        simulateLoadComplete(); // Ensure the form is rendered

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

        simulateLoadComplete(); // Ensure the form is rendered

        fireEvent.change(screen.getByTestId('password'), {
            target: { value: 'A1a!aaaa' },
        });
        fireEvent.change(screen.getByTestId('repeat password'), {
            target: { value: 'A1a!aaaa' },
        });

        fireEvent.click(screen.getByText('Guardar'));

        // Wait for the AlertInfo component to appear after the error is caught
        await waitFor(() =>
            expect(screen.getByTestId('alert-info')).toBeInTheDocument()
        );

        // Advance timers to trigger the redirect logic
        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(pushMock).toHaveBeenCalledWith(
            '/forgot-password?email=test%40mail.com'
        );
    });
});
