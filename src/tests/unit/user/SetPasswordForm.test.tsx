import React from 'react';
import { render, screen, act } from '@testing-library/react';
import SetPasswordForm from '@/components/modules/auth/forms/SetPasswordForm';
import { useRouter } from 'next/navigation';
import SetPasswordUser from '@/components/modules/auth/common/SetPasswordUser';
import {
    fetchJwtBaseApi,
    fetchTokenCrsfApi,
} from '@/lib/shared/utils/fetchApi';
import { loginApi } from '@/lib/modules/auth/utils/authUtils';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/lib/shared/utils/fetchApi');
jest.mock('@/lib/modules/auth/utils/authUtils');
jest.mock('@/components/modules/auth/common/SetPasswordUser', () =>
    jest.fn(({ onSubmitPassword }) => (
        <div
            onClick={() => onSubmitPassword('test@example.com', 'Password123!')}
        >
            SetPasswordUser
        </div>
    ))
);
jest.mock('@/components/modules/auth/common/AnimatedPage', () =>
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
        render(<SetPasswordForm />);
        expect(screen.getByText('SetPasswordUser')).toBeInTheDocument();

        const setPasswordUserMock = SetPasswordUser as unknown as jest.Mock;
        expect(setPasswordUserMock).toHaveBeenCalled();
    });

    it('crea usuario, obtiene token y redirige a /user', async () => {
        mockedFetchJwtBaseApi.mockResolvedValue({ success: true });
        mockedFetchTokenCrsfApi.mockResolvedValue(undefined);
        mockedLoginApi.mockResolvedValue({ token: 'jwtToken', userId: 1 });

        render(<SetPasswordForm />);

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

        render(<SetPasswordForm />);
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

        render(<SetPasswordForm />);
        const setPasswordUserMock = SetPasswordUser as unknown as jest.Mock;
        const onSubmitPassword =
            setPasswordUserMock.mock.calls[0][0].onSubmitPassword;

        await act(async () => {
            try {
                await onSubmitPassword('test@example.com', 'Password123!');
            } catch {}
        });

        expect(mockedFetchJwtBaseApi).toHaveBeenCalled();
        expect(mockedFetchTokenCrsfApi).toHaveBeenCalled();
        expect(mockedLoginApi).toHaveBeenCalled();
        expect(mockedRouterPush).not.toHaveBeenCalled();
    });

    it('maneja errores de manera silenciosa', async () => {
        mockedFetchJwtBaseApi.mockRejectedValue(new Error('API error'));

        render(<SetPasswordForm />);
        const setPasswordUserMock = SetPasswordUser as unknown as jest.Mock;
        const onSubmitPassword =
            setPasswordUserMock.mock.calls[0][0].onSubmitPassword;

        await act(async () => {
            await onSubmitPassword('test@example.com', 'Password123!');
        });

        expect(mockedRouterPush).not.toHaveBeenCalled();
    });
});
