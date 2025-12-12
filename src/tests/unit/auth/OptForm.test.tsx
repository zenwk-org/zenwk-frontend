import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Opt from '@/components/modules/auth/forms/OptForm';
import {
    fetchValidateTokenApi,
    fetchTokenApi,
    ClientError,
} from '@/lib/shared/utils/fetchApi';
import { useRouter, useSearchParams } from 'next/navigation';

// Mocks de constantes
const AuthErrors = {
    funciontal: { login: { emailNotMatch: 'LOGIN_EMAIL_NOT_MATCH' } },
};
const AuthMessages = {
    otp: {
        title: 'Aquí está tu código',
        subtitleSendEmail: 'Revisa tu correo',
        subtitleEnterCode: 'ingresa el código recibido para continuar.',
        emailNotFound: '¿No te ha llegado el código? ',
        checkSpamOrClick: 'Revisa tu bandeja de spam o presiona ',
        resendCodeLink: ' para que te lo enviemos de nuevo.',
        codeResentSuccess: 'Nuevo código enviado',
    },
};
const Messages = {
    commons: {
        literalTexts: {
            confirmReturn: 'Para volver al registro, pulsa ',
            register: 'Regístrate',
            here: 'aquí',
        },
    },
};
const UserMessages = {
    messageToolTip: { back: 'Volver' },
};

jest.mock('@auth/constants/auth-errors', () => ({ AuthErrors }));
jest.mock('@auth/constants/auth-messages', () => ({ AuthMessages }));
jest.mock('@app/shared/constants/messages', () => ({ Messages }));
jest.mock('@user/constants/user-messages', () => ({ UserMessages }));

// Mocks de fetch-api
jest.mock('@app/helpers/fetch-api', () => ({
    fetchValidateTokenApi: jest.fn(),
    fetchTokenApi: jest.fn(),
    ClientError: class {
        code: string;
        message: string;
        constructor(code: string, message: string) {
            this.code = code;
            this.message = message;
        }
    },
    isClientErrorMessage: jest.fn(
        (e: any) => e instanceof Error // o instancia adecuada
    ),
}));

// Mocks de Next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

function mockSearchParams(
    email: string | null = 'test@mail.com',
    uuid = '1234'
) {
    (useSearchParams as jest.Mock).mockReturnValue({
        get: (param: string) =>
            param === 'email' ? email : param === 'uuid' ? uuid : null,
        toString: () =>
            email && uuid
                ? `email=${encodeURIComponent(email)}&uuid=${uuid}`
                : '',
    });
}

function mockRouter() {
    return { push: jest.fn(), replace: jest.fn() };
}

describe('Opt Component', () => {
    let routerMock: ReturnType<typeof mockRouter>;

    beforeEach(() => {
        jest.clearAllMocks();
        routerMock = mockRouter();
        (useRouter as jest.Mock).mockReturnValue(routerMock);
        mockSearchParams();
    });

    test('Renderiza correctamente elementos base', () => {
        render(<Opt />);

        // Título responsivo — puede repetirse en varios spans
        const titleSpans = screen.getAllByText('Aquí está tu código');
        expect(titleSpans.length).toBeGreaterThan(0);
        expect(titleSpans[0]).toBeInTheDocument();

        // Subtítulo — matcher flexible porque podría estar dividido
        const subtitles = screen.getAllByText((text) =>
            text.includes('Revisa tu correo')
        );
        expect(subtitles.length).toBeGreaterThan(0);

        // Email: puede repetirse varias veces en DOM → usamos getAllByText
        const emailLabels = screen.getAllByText('test@mail.com');
        expect(emailLabels.length).toBeGreaterThan(0);
        // Opcional: verificar uno específico, por ejemplo el primero
        expect(emailLabels[0]).toBeInTheDocument();

        // Inputs OTP
        expect(screen.getAllByRole('textbox')).toHaveLength(6);
    });

    test('Ingresa 6 dígitos y navega cuando el código es válido', async () => {
        (fetchValidateTokenApi as jest.Mock).mockResolvedValue({
            success: true,
        });
        render(<Opt />);

        const inputs = screen.getAllByRole('textbox');
        inputs.forEach((inp, i) =>
            fireEvent.change(inp, { target: { value: `${i}` } })
        );

        await waitFor(() => {
            expect(fetchValidateTokenApi).toHaveBeenCalledWith(
                '012345',
                'test@mail.com',
                '1234'
            );
        });

        expect(routerMock.push).toHaveBeenCalledWith(
            '/register/set-password?email=test%40mail.com&uuid=1234'
        );
    });

    test('Muestra error funcional ClientError y botón limpiar', async () => {
        (fetchValidateTokenApi as jest.Mock).mockRejectedValue(
            new ClientError('EMAIL_NOT_MATCH', 'El correo no coincide')
        );
        render(<Opt />);

        const inputs = screen.getAllByRole('textbox');
        inputs.forEach((inp, i) =>
            fireEvent.change(inp, { target: { value: `${i}` } })
        );

        // Verificar que aparece el mensaje de error
        const errorEl = await screen.findByText((content) =>
            content.includes('El correo no coincide')
        );
        expect(errorEl).toBeInTheDocument();

        // Ahora, para el botón “Limpiar y reintentar”, usar getAllByText
        const cleanBtns = screen.getAllByText('Limpiar y reintentar');
        expect(cleanBtns.length).toBeGreaterThan(0);
        // Tomamos el primero y click
        fireEvent.click(cleanBtns[0]);

        // Verificar que los inputs quedaron vacíos
        inputs.forEach((inp) =>
            expect((inp as HTMLInputElement).value).toBe('')
        );
    });

    test('Muestra link a registro cuando email no coincide (codeError)', async () => {
        (fetchValidateTokenApi as jest.Mock).mockRejectedValue(
            new ClientError(
                AuthErrors.funciontal.login.emailNotMatch,
                'correo incorrecto'
            )
        );
        mockSearchParams('test@mail.com', '1234');
        render(<Opt />);

        const inputs = screen.getAllByRole('textbox');
        inputs.forEach((inp, i) =>
            fireEvent.change(inp, { target: { value: `${i}` } })
        );

        const link = await screen.findByText((content) =>
            content.includes(Messages.commons.literalTexts.register)
        );
        expect(link).toBeInTheDocument();
    });

    test('Muestra error inesperado', async () => {
        (fetchValidateTokenApi as jest.Mock).mockRejectedValue(
            new Error('Error raro')
        );
        render(<Opt />);

        const inputs = screen.getAllByRole('textbox');
        inputs.forEach((inp, i) =>
            fireEvent.change(inp, { target: { value: `${i}` } })
        );

        const err = await screen.findByText((content) =>
            content.includes('Error raro')
        );
        expect(err).toBeInTheDocument();
    });

    test('Reenvía el código OTP correctamente', async () => {
        (fetchTokenApi as jest.Mock).mockResolvedValue({ uuid: '9999' });
        render(<Opt />);

        const btns = screen.getAllByText(Messages.commons.literalTexts.here);
        fireEvent.click(btns[0]);

        await waitFor(() =>
            expect(fetchTokenApi).toHaveBeenCalledWith('test@mail.com')
        );
        expect(routerMock.replace).toHaveBeenCalledWith(
            '?email=test%40mail.com&uuid=9999'
        );
    });

    test('Muestra mensaje de éxito después de reenviar el código', async () => {
        (fetchTokenApi as jest.Mock).mockResolvedValue({ uuid: '9999' });
        render(<Opt />);

        fireEvent.click(
            screen.getAllByText(Messages.commons.literalTexts.here)[0]
        );

        // Usamos findAllByText / getAllByText y chequeamos que al menos uno existe
        const successMessages = await screen.findAllByText((content) =>
            content.includes(AuthMessages.otp.codeResentSuccess)
        );
        expect(successMessages.length).toBeGreaterThan(0);
        // Por si quieres verificar el primero:
        expect(successMessages[0]).toBeInTheDocument();
    });

    test('Botón atrás navega correctamente si existe correo', () => {
        render(<Opt />);

        const back = screen.getByRole('button', {
            name: UserMessages.messageToolTip.back,
        });
        fireEvent.click(back);
        expect(routerMock.push).toHaveBeenCalledWith(
            `/register?email=test@mail.com`
        );
    });

    test('Botón atrás navega correctamente si NO existe correo', () => {
        mockSearchParams(null, '1234');
        render(<Opt />);

        const back = screen.getByRole('button', {
            name: UserMessages.messageToolTip.back,
        });
        fireEvent.click(back);
        expect(routerMock.push).toHaveBeenCalledWith('/login');
    });
});
