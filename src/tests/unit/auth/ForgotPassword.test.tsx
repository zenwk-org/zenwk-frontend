/**
 * @jest-environment jsdom
 */
import React from 'react';
import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from '@testing-library/react';
import { useSearchParams, useRouter } from 'next/navigation';

import ForgotPassword from '@app/app/(auth)/(pages)/login/forgot-password/ForgotPassword';

import {
    fetchVerifcation,
    fetchValidateRegisterEmail,
    isClientErrorMessage,
} from '@app/helpers/fetch-api';
import { AuthMessages } from '@app/app/(auth)/constants/auth-messages';

// -------------------------
// Mocks base
// -------------------------
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

jest.mock('@app/shared/utils/formValidate', () => ({
    formValidate: jest.fn(() => ({
        patternEmail: /^.+@.+\..+$/,
        requiredEmail: 'Email is required',
    })),
}));

jest.mock('@app/helpers/fetch-api', () => ({
    fetchValidateRegisterEmail: jest.fn(),
    getUrlServer: jest.fn(() => 'http://test-server'),
    fetchVerifcation: jest.fn(),
    isClientErrorMessage: jest.fn(),
}));

jest.mock('@app/shared/ui/Spinner', () => () => <div>loading-spinner</div>);
jest.mock('@app/shared/ui/FormError', () => ({ error }: any) => (
    <div data-testid="form-error">{error}</div>
));
jest.mock(
    '@auth/components/LoadButton',
    () =>
        ({ textButton, loading }: any) => (
            <button type="submit" disabled={loading} data-testid="load-button">
                {loading ? '...Loading' : textButton}
            </button>
        )
);
jest.mock('@app/shared/components/AlertInfo', () => ({ children }: any) => (
    <div data-testid="alert-info">{children}</div>
));
jest.mock('@user/ui/user-feed/Text', () => (props: any) => (
    <div data-testid="user-text">{props.text}</div>
));

jest.mock(
    '@auth/components/HeaderAction',
    () =>
        ({ title, message, onAction }: any) => (
            <div data-testid="header-action">
                <h1 onClick={onAction}>{title}</h1>
                <p>{message}</p>
            </div>
        )
);
jest.mock('@auth/components/AnimatedPage', () => ({ children }: any) => (
    <div data-testid="animated-page">{children}</div>
));
jest.mock('@app/shared/ui/GeneralPageInfo', () => ({ title, onBack }: any) => (
    <div data-testid="general-page-info">
        <h2>{title}</h2>
        <button onClick={onBack}>Back</button>
    </div>
));
jest.mock('next/link', () => ({ children, href }: any) => (
    <a data-testid="next-link" href={href}>
        {children}
    </a>
));
jest.mock('@mui/icons-material/ArrowBack', () => () => (
    <div data-testid="arrow-back-icon" />
));

jest.useFakeTimers();

describe('ForgotPassword Component - FIXED VERSION', () => {
    const pushMock = jest.fn();

    const createMocks = (emailParam: string | null = null) => {
        (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn((key: string) => {
                if (key === 'email') return emailParam;
                return null;
            }),
        });
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (fetchValidateRegisterEmail as jest.Mock).mockResolvedValue(true);
        (fetchVerifcation as jest.Mock).mockResolvedValue(true);

        const mockedIsClientErrorMessage =
            isClientErrorMessage as jest.MockedFunction<
                typeof isClientErrorMessage
            >;
        mockedIsClientErrorMessage.mockReturnValue(false);
    });

    // --- Render básico robusto (spinner o título) ---
    it('should show spinner or the form title (robust to sync timing)', async () => {
        createMocks();

        const { container } = render(<ForgotPassword />);

        // El spinner puede aparecer brevemente. Aceptamos cualquiera de los dos estados
        const spinner = container.querySelector(
            '[data-testid="loading-spinner"]'
        );
        if (spinner) {
            expect(spinner).toBeInTheDocument();
        } else {
            // Si el effect ya corrió, al menos el título debe estar presente
            expect(
                await screen.findByText(AuthMessages.forgotPassword.title)
            ).toBeInTheDocument();
        }
    });

    it('should populate email from URL param', async () => {
        const email = 'param@test.com';
        createMocks(email);

        render(<ForgotPassword />);

        // Esperamos a que el componente refleje el valor
        const input = await screen.findByPlaceholderText('name@your-email.com');
        expect(input).toHaveValue(email);
    });

    // --- Navegación / handleOnBack ---

    it('should navigate back to login when clicking header title', async () => {
        const email = 'abc@test.com';
        createMocks(email);

        render(<ForgotPassword />);

        // click en header title dispara handleOnBack
        const headerTitle = await screen.findByText(
            AuthMessages.forgotPassword.title
        );
        await act(async () => {
            fireEvent.click(headerTitle);
        });

        expect(pushMock).toHaveBeenCalledWith(`/login?email=${email}`);
    });

    // --- Envío exitoso ---

    it('should handle successful submission and show success info screen', async () => {
        createMocks();
        render(<ForgotPassword />);

        const email = 'existing@user.com';
        const input = await screen.findByPlaceholderText('name@your-email.com');

        await act(async () => {
            fireEvent.change(input, { target: { value: email } });
            fireEvent.click(screen.getByTestId('load-button'));
        });

        await waitFor(() =>
            expect(fetchValidateRegisterEmail).toHaveBeenCalledWith(email)
        );

        await waitFor(() => expect(fetchVerifcation).toHaveBeenCalled());

        expect(
            await screen.findByTestId('general-page-info')
        ).toBeInTheDocument();
    });

    // --- Rama: usuario NO existe -> countdown -> redirect ---
    it('should show countdown and redirect to register when email is NOT registered', async () => {
        createMocks();
        (fetchValidateRegisterEmail as jest.Mock).mockResolvedValue(false);

        render(<ForgotPassword />);

        const input = await screen.findByPlaceholderText('name@your-email.com');

        await act(async () => {
            fireEvent.change(input, { target: { value: 'noexist@test.com' } });
            fireEvent.click(screen.getByTestId('load-button'));
        });

        // Aparece la alerta con el texto de "Correo no registrado."
        expect(await screen.findByTestId('alert-info')).toBeInTheDocument();
        // label con "3 s..." inicial
        expect(screen.getByText(/3 s\.\.\./)).toBeInTheDocument();

        // Avanza 1s -> 2 s...
        act(() => jest.advanceTimersByTime(1000));
        expect(screen.getByText(/2 s\.\.\./)).toBeInTheDocument();

        // Avanza 1s -> 1 s...
        act(() => jest.advanceTimersByTime(1000));
        expect(screen.getByText(/1 s\.\.\./)).toBeInTheDocument();

        // Avanza 1s -> redirige
        act(() => jest.advanceTimersByTime(1000));

        await waitFor(() =>
            expect(pushMock).toHaveBeenCalledWith(
                `/register?email=${encodeURIComponent('noexist@test.com')}`
            )
        );
    });

    // --- Validaciones ---
    it('should show required error when email empty', async () => {
        createMocks();
        render(<ForgotPassword />);

        const input = await screen.findByPlaceholderText('name@your-email.com');

        await act(async () => {
            fireEvent.change(input, { target: { value: '' } });
            fireEvent.click(screen.getByTestId('load-button'));
        });

        await waitFor(() => {
            expect(screen.getByTestId('form-error')).toHaveTextContent(
                'Email is required'
            );
        });
    });

    it('should show pattern error on invalid email', async () => {
        createMocks();
        render(<ForgotPassword />);

        const input = await screen.findByPlaceholderText('name@your-email.com');

        await act(async () => {
            fireEvent.change(input, { target: { value: 'invalid' } });
            fireEvent.click(screen.getByTestId('load-button'));
        });

        await waitFor(() =>
            expect(screen.getByTestId('form-error')).toBeInTheDocument()
        );
    });

    // --- Error API (client error) ---
    it('should show API client error', async () => {
        createMocks();

        (fetchValidateRegisterEmail as jest.Mock).mockRejectedValue({
            message: 'User not found in DB',
        });
        const mockedIsClientErrorMessage =
            isClientErrorMessage as jest.MockedFunction<
                typeof isClientErrorMessage
            >;
        mockedIsClientErrorMessage.mockReturnValue(true);

        render(<ForgotPassword />);

        const input = await screen.findByPlaceholderText('name@your-email.com');

        await act(async () => {
            fireEvent.change(input, { target: { value: 'test@error.com' } });
            fireEvent.click(screen.getByTestId('load-button'));
        });

        await waitFor(() =>
            expect(screen.getByTestId('form-error')).toHaveTextContent(
                'User not found in DB'
            )
        );
    });
});
