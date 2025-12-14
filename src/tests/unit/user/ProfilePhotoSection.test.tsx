import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePhotoSection from '@/components/modules/user/profile/ProfilePhotoSection';
import { UserMessages } from '@/lib/modules/user/constants/user-messages';

// MOCKS necesarios
jest.mock('@/lib/modules/user/utils/imageConvertUtils', () => ({
    compressImage: jest
        .fn()
        .mockResolvedValue(
            new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' })
        ),
}));

jest.mock('@/lib/shared/utils/fetchApi', () => ({
    fetchJwtBaseApi: jest.fn().mockResolvedValue({ ok: true }),
}));

jest.mock('@/lib/modules/user/utils/personUtils', () => ({
    updateOrCreatePerson: jest.fn(),
}));

const mockUsePersonContext = jest.fn();

jest.mock('@/hooks/modules/user/usePersonContext', () => ({
    usePersonContext: jest.fn().mockReturnValue({
        person: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            profilePicture: undefined,
        },
        setPerson: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            profilePicture: undefined,
        },
    }),
}));

// Util simple
const mockSetLineLoadingFather = jest.fn();

// Mock Spinner
jest.mock('@/components/shared/ui/Spinner', () => () => (
    <div data-testid="spinner" />
));

jest.spyOn(URL, 'createObjectURL').mockReturnValue('mock-url');
jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

describe('ProfilePhotoSection Component', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Renderiza Spinner si no hay person', () => {
        (
            require('@/hooks/modules/user/usePersonContext')
                .usePersonContext as jest.Mock
        ).mockReturnValueOnce({});
        render(
            <ProfilePhotoSection
                setLineLoadingFather={mockSetLineLoadingFather}
            />
        );
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    test('Muestra iniciales si no hay foto previa', () => {
        render(
            <ProfilePhotoSection
                setLineLoadingFather={mockSetLineLoadingFather}
            />
        );
        expect(screen.getByTestId('initials')).toHaveTextContent(/J\.D\.?/);
    });

    test('Dispara input de carga al hacer click en cambiar foto', () => {
        render(
            <ProfilePhotoSection
                setLineLoadingFather={mockSetLineLoadingFather}
            />
        );

        const fileInput = screen.queryByTestId('photo-file-input');
        expect(fileInput).not.toBeNull();
    });

    test('handleFileChange dispara preview y savePhoto automáticamente', async () => {
        render(
            <ProfilePhotoSection
                setLineLoadingFather={mockSetLineLoadingFather}
            />
        );

        const input = screen.getByTestId('photo-file-input');
        const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' });

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(
                require('@/lib/modules/user/utils/imageConvertUtils')
                    .compressImage
            ).toHaveBeenCalled();
        });
    });

    test('deletePhotoHandleClick reinicia estados', () => {
        mockUsePersonContext.mockReturnValueOnce({
            person: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                profilePicture: 'abc123',
            },
            setPerson: jest.fn(),
        });

        render(
            <ProfilePhotoSection
                setLineLoadingFather={mockSetLineLoadingFather}
            />
        );

        const deleteText =
            UserMessages.profileConfiguration.sections.updatePhotoProfile
                .changeButton;

        const deleteButton = screen.getByRole('button', { name: deleteText });

        fireEvent.click(deleteButton);

        expect(screen.getByTestId('initials')).toBeInTheDocument();
    });

    test('loadingLineClick(loadPhoto) activa y desactiva estados correctamente', async () => {
        jest.useFakeTimers();

        render(
            <ProfilePhotoSection
                setLineLoadingFather={mockSetLineLoadingFather}
            />
        );

        const input = screen.getByTestId('photo-file-input');
        const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' });

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(mockSetLineLoadingFather).toHaveBeenCalledWith(true);
        });

        jest.runAllTimers();

        await waitFor(() => {
            expect(mockSetLineLoadingFather).toHaveBeenCalledWith(false);
        });

        jest.useRealTimers();
    });

    test('loadingLineClick(savePhoto) activa estados de guardado', async () => {
        jest.useFakeTimers();

        (
            require('@/hooks/modules/user/usePersonContext')
                .usePersonContext as jest.Mock
        ).mockReturnValueOnce({
            person: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                profilePicture: 'abc123',
            },
            setPerson: jest.fn((cb) =>
                cb({
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    profilePicture: 'abc123',
                })
            ),
        });

        render(
            <ProfilePhotoSection
                setLineLoadingFather={mockSetLineLoadingFather}
            />
        );

        const input = screen.getByTestId('photo-file-input');
        const file = new File(['blob'], 'img.jpg', { type: 'image/jpeg' });

        fireEvent.change(input, { target: { files: [file] } });

        jest.runAllTimers();

        await waitFor(() => {
            expect(mockSetLineLoadingFather).toHaveBeenCalled();
        });

        jest.useRealTimers();
    });

    test('loadingLineClick(deletePhoto) activa y desactiva el loader correctamente', async () => {
        jest.useFakeTimers();

        (
            require('@/hooks/modules/user/usePersonContext')
                .usePersonContext as jest.Mock
        ).mockReturnValueOnce({
            person: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                profilePicture: 'abc123',
            },
            setPerson: jest.fn((cb) =>
                cb({
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    profilePicture: 'abc123',
                })
            ),
        });

        render(
            <ProfilePhotoSection
                setLineLoadingFather={mockSetLineLoadingFather}
            />
        );

        const deleteButton = screen.getByRole('button', {
            name: UserMessages.profileConfiguration.sections.updatePhotoProfile
                .deleteButton,
        });

        fireEvent.click(deleteButton);

        await waitFor(() =>
            expect(mockSetLineLoadingFather).toHaveBeenCalledWith(true)
        );

        jest.runAllTimers();

        await waitFor(() =>
            expect(mockSetLineLoadingFather).toHaveBeenCalledWith(false)
        );

        jest.useRealTimers();
    });

    test('deletePhotoHandleClick cubre rama prev == null', async () => {
        const mockSetPerson = jest.fn((cb) => cb(null));

        (
            require('@/hooks/modules/user/usePersonContext')
                .usePersonContext as jest.Mock
        ).mockReturnValue({
            person: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                profilePicture: 'ABC',
            },
            setPerson: mockSetPerson,
        });

        render(<ProfilePhotoSection setLineLoadingFather={jest.fn()} />);

        const deleteButton = screen.getByRole('button', {
            name: UserMessages.profileConfiguration.sections.updatePhotoProfile
                .deleteButton,
        });

        fireEvent.click(deleteButton);

        expect(mockSetPerson).toHaveBeenCalled();

        const callbackResult = mockSetPerson.mock.calls[0][0](null);
        expect(callbackResult).toBeNull();
    });

    test('savePhotoHandleClick cubre la rama prev && {...}', async () => {
        class MockFileReader {
            onloadend: any = null;
            result = 'data:image/jpeg;base64,MOCK_BASE_64';

            readAsDataURL() {
                this.onloadend();
            }
        }
        (global as any).FileReader = MockFileReader;

        jest.mock('@/lib/shared/utils/fetchApi', () => ({
            fetchJwtBaseApi: jest.fn().mockResolvedValue({}),
        }));

        const mockSetPerson = jest.fn((cb) =>
            cb({
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                profilePicture: 'OLD',
            })
        );

        (
            require('@/hooks/modules/user/usePersonContext')
                .usePersonContext as jest.Mock
        ).mockReturnValue({
            person: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                profilePicture: 'OLD',
            },
            setPerson: mockSetPerson,
        });

        render(<ProfilePhotoSection setLineLoadingFather={jest.fn()} />);

        const input = screen.getByTestId('photo-file-input');
        const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' });
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(mockSetPerson).toHaveBeenCalled();
        });

        const callback = mockSetPerson.mock.calls[0][0];
        const result = callback({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            profilePicture: 'OLD',
        });

        expect(result).toEqual({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            profilePicture: 'MOCK_BASE_64',
        });
    });
});
