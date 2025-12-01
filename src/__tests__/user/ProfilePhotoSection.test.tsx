import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePhotoSection from '@user/ui/profile/ProfilePhotoSection';
import { UserMessages } from '@user/constants/user-messages';

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
        setPerson: jest.fn(),
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
            setPerson: jest.fn(),
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
});
