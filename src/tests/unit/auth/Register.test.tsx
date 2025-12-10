import React from 'react';
import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from '@testing-library/react';
import Register from '@app/app/(auth)/(pages)/register/Register';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    fetchTokenApi,
    fetchValidateRegisterEmail,
} from '@app/helpers/fetch-api';
import { formValidate } from '@app/shared/utils/formValidate';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));
jest.mock('@app/helpers/fetch-api');
jest.mock('@app/shared/utils/formValidate');

const mockedRouterPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockedRouterPush });

const mockedUseSearchParams = useSearchParams as jest.Mock;
const mockedFetchTokenApi = fetchTokenApi as jest.MockedFunction<
    typeof fetchTokenApi
>;
const mockedFetchValidateEmail =
    fetchValidateRegisterEmail as jest.MockedFunction<
        typeof fetchValidateRegisterEmail
    >;
const mockedFormValidate = formValidate as jest.MockedFunction<
    typeof formValidate
>;

describe('Register Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedFormValidate.mockReturnValue({
            requiredEmail: 'Required',
            patternEmail: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email',
            },
            requiredPassword: '', // dummy
            patternPassword: { value: /./, message: '' }, // dummy
            minLength: { value: 0, message: '' }, // dummy
            validateTrim: {}, // dummy
            validateEquals: () => ({}) as any, // dummy
        } as any);
    });

    it('renderiza correctamente sin email ni fromHome', () => {
        mockedUseSearchParams.mockReturnValue({ get: () => null });
        render(<Register />);

        // Buscar cualquier nodo que contenga "Empieza a usar ZenWk"
        const header = screen.getAllByText(/empieza a usar zenwk/i)[0];
        expect(header).toBeInTheDocument();

        // Buscar el input de email
        expect(
            screen.getByPlaceholderText(/name@your-email.com/i)
        ).toBeInTheDocument();
    });

    it('handleOnBack redirige a / si fromHome=true', () => {
        mockedUseSearchParams.mockReturnValue({
            get: (key: string) => (key === 'fromHome' ? '1' : null),
        });
        render(<Register />);
        const backButton = screen.getByTestId('HomeIcon').closest('button');
        fireEvent.click(backButton!);
        expect(mockedRouterPush).toHaveBeenCalledWith('/');
    });

    it('handleOnBack redirige a /login?email=... si email existe', () => {
        mockedUseSearchParams.mockReturnValue({
            get: (key: string) => (key === 'email' ? 'test@example.com' : null),
        });
        render(<Register />);
        const backButton = screen
            .getByTestId('ArrowBackIcon')
            .closest('button');
        fireEvent.click(backButton!);
        expect(mockedRouterPush).toHaveBeenCalledWith(
            '/login?email=test@example.com'
        );
    });

    it('onSubmit: email no existente, llama fetchTokenApi y redirige', async () => {
        mockedUseSearchParams.mockReturnValue({
            get: () => 'test@example.com',
        });
        mockedFetchValidateEmail.mockResolvedValue(false);
        mockedFetchTokenApi.mockResolvedValue({
            email: 'test@example.com',
            uuid: 'uuid123',
        });

        render(<Register />);
        const input =
            await screen.findByPlaceholderText(/name@your-email.com/i);
        const form = input.closest('form') as HTMLFormElement;

        fireEvent.change(input, { target: { value: 'test@example.com' } });

        await act(async () => {
            fireEvent.submit(form);
        });

        await waitFor(() => {
            expect(mockedFetchValidateEmail).toHaveBeenCalledWith(
                'test@example.com'
            );
            expect(mockedFetchTokenApi).toHaveBeenCalledWith(
                'test@example.com'
            );
            expect(mockedRouterPush).toHaveBeenCalledWith(
                '/register/opt?email=test%40example.com&uuid=uuid123'
            );
        });
    });

    it('onSubmit: email existente muestra AlertInfo y redirige tras countdown', async () => {
        mockedUseSearchParams.mockReturnValue({
            get: () => 'test@example.com',
        });
        mockedFetchValidateEmail.mockResolvedValue(false);
        mockedFetchTokenApi.mockResolvedValue({
            email: 'test@example.com',
            uuid: 'uuid123',
        });

        render(<Register />);
        const input =
            await screen.findByPlaceholderText(/name@your-email.com/i);
        const form = input.closest('form') as HTMLFormElement;

        fireEvent.change(input, { target: { value: 'test@example.com' } });

        await act(async () => {
            fireEvent.submit(form);
        });

        await waitFor(() => {
            expect(mockedFetchValidateEmail).toHaveBeenCalledWith(
                'test@example.com'
            );
            expect(mockedFetchTokenApi).toHaveBeenCalledWith(
                'test@example.com'
            );
            expect(mockedRouterPush).toHaveBeenCalledWith(
                '/register/opt?email=test%40example.com&uuid=uuid123'
            );
        });
    });

    it('onSubmit: error en fetchValidateRegisterEmail, llama setError', async () => {
        mockedUseSearchParams.mockReturnValue({
            get: () => 'test@example.com',
        });
        mockedFetchValidateEmail.mockRejectedValue('Error test');

        render(<Register />);
        const input =
            await screen.findByPlaceholderText(/name@your-email.com/i);
        const form = input.closest('form') as HTMLFormElement;

        fireEvent.change(input, { target: { value: 'test@example.com' } });

        await act(async () => {
            fireEvent.submit(form);
        });

        expect(await screen.findByText('Error test')).toBeInTheDocument();
    });

    // Test para cubrir el countdown en onSubmit cuando el email ya existe
    it('onSubmit: email existente activa countdown y redirige al login', async () => {
        jest.useFakeTimers(); // Simular timers

        mockedUseSearchParams.mockReturnValue({
            get: () => 'existing@example.com',
        });
        mockedFetchValidateEmail.mockResolvedValue(true); // Email existe

        render(<Register />);
        const input =
            await screen.findByPlaceholderText(/name@your-email.com/i);
        const form = input.closest('form') as HTMLFormElement;

        fireEvent.change(input, { target: { value: 'existing@example.com' } });

        await act(async () => {
            fireEvent.submit(form);
        });

        // Debe mostrar el usuario existente y countdown inicial
        expect(await screen.getAllByText(/3/)[0]).toBeInTheDocument();

        // Avanzar el tiempo del countdown
        act(() => {
            jest.advanceTimersByTime(1000); // 2
            jest.advanceTimersByTime(1000); // 1
            jest.advanceTimersByTime(1000); // 0
        });

        await waitFor(() => {
            expect(mockedRouterPush).toHaveBeenCalledWith(
                '/login?email=existing%40example.com'
            );
        });

        jest.useRealTimers();
    });

    // Test para cubrir handleOnBack sin fromHome ni email
    it('handleOnBack redirige a /login si no hay fromHome ni email', () => {
        mockedUseSearchParams.mockReturnValue({ get: () => null });
        render(<Register />);
        const backButton = screen
            .getByTestId('ArrowBackIcon')
            .closest('button');
        fireEvent.click(backButton!);
        expect(mockedRouterPush).toHaveBeenCalledWith('/login');
    });
});
