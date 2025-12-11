import React from 'react'; // ⚠️ Necesario para JSX
import { render, screen, act } from '@testing-library/react';
import SetPasswordRegister from '@app/components/modules/auth/forms/SetPasswordForm';
import { useRouter } from 'next/navigation';
import SetPasswordUser from '@app/components/modules/auth/commons/SetPasswordUser';
import {
    fetchJwtBaseApi,
    fetchTokenCrsfApi,
} from '@app/lib/shared/utils/fetchApi';
import { loginApi } from '@app/lib/modules/auth/utils/authUtils';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@app/helpers/fetch-api');
jest.mock('@auth/utils/authUtils');
jest.mock('@auth/components/SetPasswordUser', () =>
    jest.fn(({ onSubmitPassword }) => (
        <div
            onClick={() => onSubmitPassword('test@example.com', 'Password123!')}
        >
            SetPasswordUser
        </div>
    ))
);
jest.mock('@auth/components/AnimatedPage', () =>
    jest.fn(({ children }) => <div>{children}</div>)
);

describe('SetPasswordRegister Component', () => {
    const mockedRouterPush = jest.fn();
    const mockedUseRouter = useRouter as jest.Mock;
    const mockedFetchJwtBaseApi = fetchJwtBaseApi as jest.MockedFunction<
        typeof fetchJwtBaseApi
    >;
    const mockedFetchTokenCrsfApi = fetchTokenCrsfApi as jest.MockedFunction<
        typeof fetchTokenCrsfApi
    >;
    const mockedLoginApi = loginApi as jest.MockedFunction<typeof loginApi>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseRouter.mockReturnValue({ push: mockedRouterPush });
    });

    it('renderiza correctamente', () => {
        render(<SetPasswordRegister />);
        expect(screen.getByText('SetPasswordUser')).toBeInTheDocument();

        const setPasswordUserMock = SetPasswordUser as unknown as jest.Mock;
        expect(setPasswordUserMock).toHaveBeenCalled();
    });

    it('crea usuario, obtiene token y redirige a /user', async () => {
        mockedFetchJwtBaseApi.mockResolvedValue({ success: true });
        mockedFetchTokenCrsfApi.mockResolvedValue(undefined);
        mockedLoginApi.mockResolvedValue({ token: 'jwtToken', userId: 1 });

        render(<SetPasswordRegister />);

        const setPasswordUserMock = SetPasswordUser as unknown as jest.Mock;
        const onSubmitPassword =
            setPasswordUserMock.mock.calls[0][0].onSubmitPassword;

        await act(async () => {
            await onSubmitPassword('test@example.com', 'Password123!');
        });

        expect(mockedFetchJwtBaseApi).toHaveBeenCalledWith(
            '/users',
            undefined,
            undefined,
            {
                username: 'test',
                password: 'Password123!',
                email: 'test@example.com',
            },
            'POST'
        );

        expect(mockedFetchTokenCrsfApi).toHaveBeenCalledWith(
            'test@example.com'
        );
        expect(mockedLoginApi).toHaveBeenCalledWith(
            'test@example.com',
            'Password123!'
        );
        expect(mockedRouterPush).toHaveBeenCalledWith('/user');
    });

    it('no redirige si fetchJwtBaseApi devuelve null', async () => {
        mockedFetchJwtBaseApi.mockResolvedValue(null);

        render(<SetPasswordRegister />);
        const setPasswordUserMock = SetPasswordUser as unknown as jest.Mock;
        const onSubmitPassword =
            setPasswordUserMock.mock.calls[0][0].onSubmitPassword;

        await act(async () => {
            await onSubmitPassword('test@example.com', 'Password123!');
        });

        expect(mockedFetchJwtBaseApi).toHaveBeenCalled();
        expect(mockedFetchTokenCrsfApi).not.toHaveBeenCalled();
        expect(mockedLoginApi).not.toHaveBeenCalled();
        expect(mockedRouterPush).not.toHaveBeenCalled();
    });

    it('no redirige si loginApi "falla"', async () => {
        mockedFetchJwtBaseApi.mockResolvedValue({ success: true });
        mockedFetchTokenCrsfApi.mockResolvedValue(undefined);
        mockedLoginApi.mockRejectedValue(new Error('login fallido'));

        render(<SetPasswordRegister />);
        const setPasswordUserMock = SetPasswordUser as unknown as jest.Mock;
        const onSubmitPassword =
            setPasswordUserMock.mock.calls[0][0].onSubmitPassword;

        await act(async () => {
            try {
                await onSubmitPassword('test@example.com', 'Password123!');
            } catch {
                // ignoramos el error en el test
            }
        });

        expect(mockedFetchJwtBaseApi).toHaveBeenCalled();
        expect(mockedFetchTokenCrsfApi).toHaveBeenCalled();
        expect(mockedLoginApi).toHaveBeenCalled();
        expect(mockedRouterPush).not.toHaveBeenCalled();
    });

    it('maneja errores de manera silenciosa', async () => {
        mockedFetchJwtBaseApi.mockRejectedValue(new Error('API error'));

        render(<SetPasswordRegister />);
        const setPasswordUserMock = SetPasswordUser as unknown as jest.Mock;
        const onSubmitPassword =
            setPasswordUserMock.mock.calls[0][0].onSubmitPassword;

        await act(async () => {
            await onSubmitPassword('test@example.com', 'Password123!');
        });

        expect(mockedRouterPush).not.toHaveBeenCalled();
    });
});
