import React from 'react'; // ⚠️ Import obligatorio para JSX
import { render, screen, act } from '@testing-library/react';
import SetChangePassword from '@app/app/(modules)/(auth)/(pages)/login/reset-password/ResetPassword';
import { useRouter } from 'next/navigation';
import { fetchJwtBaseApi } from '@app/helpers/fetch-api';
import SetPasswordUser from '@auth/components/SetPasswordUser';

// Mock de Next Navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mock de fetch-api
jest.mock('@app/helpers/fetch-api');

// Mock del componente SetPasswordUser
jest.mock('@auth/components/SetPasswordUser', () =>
    jest.fn(({ onSubmitPassword }) => (
        <div
            onClick={() =>
                onSubmitPassword(
                    'test@example.com',
                    'Password123!',
                    'uuid123',
                    'token123'
                )
            }
        >
            SetPasswordUser
        </div>
    ))
);

// Mock del componente AnimatedPage
jest.mock('@auth/components/AnimatedPage', () =>
    jest.fn(({ children }) => <div>{children}</div>)
);

describe('SetChangePassword Component', () => {
    const mockedRouterPush = jest.fn();
    const mockedUseRouter = useRouter as jest.Mock;
    const mockedFetchJwtBaseApi = fetchJwtBaseApi as jest.MockedFunction<
        typeof fetchJwtBaseApi
    >;

    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseRouter.mockReturnValue({ push: mockedRouterPush });
    });

    it('renderiza correctamente', () => {
        render(<SetChangePassword />);
        expect(screen.getByText('SetPasswordUser')).toBeInTheDocument();

        const setPasswordUserMock = SetPasswordUser as unknown as jest.Mock;
        expect(setPasswordUserMock).toHaveBeenCalled();
    });

    it('llama fetchJwtBaseApi y redirige a /login cuando la contraseña se cambia correctamente', async () => {
        mockedFetchJwtBaseApi.mockResolvedValue({ success: true });

        render(<SetChangePassword />);

        const setPasswordUserMock = SetPasswordUser as unknown as jest.Mock;
        const onSubmitPassword =
            setPasswordUserMock.mock.calls[0][0].onSubmitPassword;

        await act(async () => {
            await onSubmitPassword(
                'test@example.com',
                'Password123!',
                'uuid123',
                'token123'
            );
        });

        expect(mockedFetchJwtBaseApi).toHaveBeenCalledWith(
            '/auth/reset-password/test@example.com',
            undefined,
            undefined,
            {
                password: 'Password123!',
                uuid: 'uuid123',
                codeToken: 'token123',
            },
            'POST'
        );

        expect(mockedRouterPush).toHaveBeenCalledWith('/login');
    });

    it('no redirige si fetchJwtBaseApi devuelve null', async () => {
        mockedFetchJwtBaseApi.mockResolvedValue(null);

        render(<SetChangePassword />);

        const setPasswordUserMock = SetPasswordUser as unknown as jest.Mock;
        const onSubmitPassword =
            setPasswordUserMock.mock.calls[0][0].onSubmitPassword;

        await act(async () => {
            await onSubmitPassword(
                'test@example.com',
                'Password123!',
                'uuid123',
                'token123'
            );
        });

        expect(mockedFetchJwtBaseApi).toHaveBeenCalled();
        expect(mockedRouterPush).not.toHaveBeenCalled();
    });
});
