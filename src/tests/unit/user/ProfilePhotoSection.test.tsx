import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePhotoSection from '@app/components/modules/user/profile/ProfilePhotoSection';
import { UserMessages } from '@app/lib/modules/user/constants/user-messages';

// MOCKS necesarios
jest.mock('@user/utils/ImageConvertUtils', () => ({
    compressImage: jest
        .fn()
        .mockResolvedValue(
            new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' })
        ),
}));

jest.mock('@app/helpers/fetch-api', () => ({
    fetchJwtBaseApi: jest.fn().mockResolvedValue({ ok: true }),
}));

jest.mock('@user/utils/personUtils', () => ({
    updateOrCreatePerson: jest.fn(),
}));

const mockUsePersonContext = jest.fn();

jest.mock('@user/utils/UsePersonContext', () => ({
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

//  Mock Spinner
jest.mock('@app/shared/ui/Spinner', () => () => <div data-testid="spinner" />);

jest.spyOn(URL, 'createObjectURL').mockReturnValue('mock-url');
jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

describe('ProfilePhotoSection Component', () => {
    beforeEach(() => jest.clearAllMocks());

    test('Renderiza Spinner si no hay person', () => {
        (
            require('@user/utils/UsePersonContext')
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
                require('@user/utils/ImageConvertUtils').compressImage
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

        // Antes de resolver el timeout
        await waitFor(() => {
            expect(mockSetLineLoadingFather).toHaveBeenCalledWith(true);
        });

        jest.runAllTimers(); // libera el setTimeout de 400ms

        await waitFor(() => {
            expect(mockSetLineLoadingFather).toHaveBeenCalledWith(false);
        });

        jest.useRealTimers();
    });

    test('loadingLineClick(savePhoto) activa estados de guardado', async () => {
        jest.useFakeTimers();

        (
            require('@user/utils/UsePersonContext')
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
            require('@user/utils/UsePersonContext')
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

        // Antes del timeout
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
        const mockSetPerson = jest.fn((cb) => cb(null)); // ← dispara el path prev == null

        (
            require('@user/utils/UsePersonContext')
                .usePersonContext as jest.Mock
        ).mockReturnValue({
            person: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                profilePicture: 'ABC', // para que se muestre el botón
            },
            setPerson: mockSetPerson,
        });

        render(<ProfilePhotoSection setLineLoadingFather={jest.fn()} />);

        const deleteButton = screen.getByRole('button', {
            name: UserMessages.profileConfiguration.sections.updatePhotoProfile
                .deleteButton,
        });

        fireEvent.click(deleteButton);

        // Verifica que se ejecutó la ruta prev == null
        expect(mockSetPerson).toHaveBeenCalled();

        // El callback debe HABER DEVUELTO null (porque return prev)
        const callbackResult = mockSetPerson.mock.calls[0][0](null);
        expect(callbackResult).toBeNull();
    });

    test('savePhotoHandleClick cubre la rama prev && {...}', async () => {
        // 1. Mock FileReader para que getBytesFromPreview funcione
        class MockFileReader {
            onloadend: any = null;
            result = 'data:image/jpeg;base64,MOCK_BASE_64';

            readAsDataURL() {
                this.onloadend(); // dispara el callback
            }
        }
        (global as any).FileReader = MockFileReader;

        // 2. Mock fetchJwtBaseApi
        jest.mock('@app/helpers/fetch-api', () => ({
            fetchJwtBaseApi: jest.fn().mockResolvedValue({}),
        }));

        // 3. Mock context con persona válida
        const mockSetPerson = jest.fn((cb) =>
            cb({
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                profilePicture: 'OLD',
            })
        );

        (
            require('@user/utils/UsePersonContext')
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

        // 4. Render
        render(<ProfilePhotoSection setLineLoadingFather={jest.fn()} />);

        // 5. Disparar handleFileChange (esto llama savePhotoHandleClick)
        const input = screen.getByTestId('photo-file-input');
        const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' });
        fireEvent.change(input, { target: { files: [file] } });

        // 6. Esperar a que savePhotoHandleClick termine
        await waitFor(() => {
            expect(mockSetPerson).toHaveBeenCalled();
        });

        // 7. Evaluar el callback manualmente → CUBRE prev && {...}
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
