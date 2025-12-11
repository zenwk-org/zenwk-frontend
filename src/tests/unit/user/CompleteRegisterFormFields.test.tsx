import React from 'react';

import { UserMessages } from '@app/lib/modules/user/constants/user-messages';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CompleteRegisterFormFields, {
    FormValues,
} from '@app/components/modules/user/forms/CompleteRegisterFormFields';
import { useForm } from 'react-hook-form';

/* ---------------- MOCKS ---------------- */
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

jest.mock('@user/ui/inputs/SelectGeneral', () => {
    const actualReact = require('react');
    return actualReact.forwardRef(
        (
            {
                // Desestructuramos y filtramos TODAS las props personalizadas
                text, // Usado para data-testid
                data, // Usado para mapear las <option>
                optionsLabel,
                variant,
                sizeTextInput,
                paramHeigth,
                isError,
                children, // Elementos hijos (ej. FormErrorUser)
                // Capturamos el resto (debe ser props nativas: value, onChange, name, placeholder, etc.)
                ...rest
            }: any,
            ref: any
        ) => (
            <div>
                <select
                    data-testid={text} // Usamos 'text' para el selector en el test
                    ref={ref}
                    {...rest} // Pasa SOLAMENTE las props nativas de HTML (value, onChange, name, etc.)
                >
                    {/* Renderiza las opciones, usando la prop 'data' */}
                    {data?.map((o: any) => (
                        // Aseguramos que los valores sean strings para consistencia con useForm
                        <option key={o.value} value={String(o.value)}>
                            {o.label}
                        </option>
                    ))}
                </select>

                {/* FIX: Ahora el error va afuera del select */}
                <div data-testid="form-error">{children}</div>
            </div>
        )
    );
});

// El mock de FormErrorUser está bien, renderiza props.error
jest.mock('@user/ui/forms/FormErrorUser', () => (props: any) => (
    <div data-testid="form-error">{props.error}</div>
));

// El mock de LoadButton está bien
jest.mock('@auth/components/LoadButton', () => (props: any) => (
    <div data-testid="loadbutton">{props.textButton}</div>
));

// El mock de ProfileButtomForm está bien
jest.mock('@user/components/profile/ProfileButtomForm', () => (props: any) => (
    <div data-testid="profile-button">{props.nameButtom}</div>
));

// FIX: Cambiamos los valores a string para consistencia con useForm defaultValues
jest.mock('@app/shared/utils/userUtils', () => ({
    ageGenerator: [
        { label: '20', value: '20' },
        { label: '21', value: '21' },
    ],
}));

/* ---------------- PU ---------------- */
describe('CompleteRegisterFormFields', () => {
    // FIX: Modificamos renderWithForm para aceptar y aplicar customProps,
    // permitiendo sobrescribir las props por defecto como 'errorBack' y 'editDataBasic'.
    const renderWithForm = (customProps?: any) => {
        const Wrapper = () => {
            const form = useForm<FormValues>({
                defaultValues: {
                    firstName: 'Carlos',
                    middleName: '',
                    lastName: '',
                    middleLastName: '',
                    // Se usan strings aquí para ser consistente con el SelectGeneral mock
                    sex: { label: 'M', value: 'M' },
                    age: { label: '20', value: '20' },
                },
                mode: 'onChange',
            });

            const defaultProps = {
                form,
                optionsSex: [
                    { label: 'M', value: 'M' },
                    { label: 'F', value: 'F' },
                ],
                onSubmit: jest.fn(),
                errorBack: null,
                isBtnLoading: false,
                // Agregamos defaults para props opcionales usadas en tests
                editDataBasic: false,
                loadingLineClick: jest.fn(),
                setEditDataBasic: jest.fn(),
            };

            return (
                <CompleteRegisterFormFields
                    {...defaultProps}
                    {...customProps} // Aplica las props personalizadas
                />
            );
        };

        return render(<Wrapper />);
    };

    test('renderiza formulario base', () => {
        renderWithForm();
        expect(screen.getByTestId('Primer nombre')).toBeInTheDocument();
        expect(screen.getByTestId('Sexo')).toBeInTheDocument();
        expect(screen.getByTestId('Edad')).toBeInTheDocument();
    });

    // FIX: Ahora que editDataBasic: true se pasa correctamente, ProfileButtomForm se renderizará
    // con el texto UserMessages.buttons.save.
    test('habilita el botón cuando hay cambios', async () => {
        // Pasa editDataBasic: true correctamente
        renderWithForm({ editDataBasic: true });
        const firstName = screen.getByTestId('Primer nombre');

        // Disparamos el cambio para activar el dirty state
        await act(async () => {
            fireEvent.change(firstName, { target: { value: 'Juan' } });
        });

        // Asumimos que UserMessages.buttons.save es el texto de uno de los botones
        // Si es 'Guardar', debería funcionar
        const saveButton = screen.getByText(UserMessages.buttons.save);
        expect(saveButton.closest('button')).not.toBeDisabled();
    });

    // FIX: Ahora que errorBack se pasa correctamente
    test('muestra error del backend', () => {
        renderWithForm({
            errorBack: { msg: 'Error backend', at: 1 },
        });
        // Si el componente pasa { msg: 'Error backend', at: 1 } como la prop error,
        // y el mock renderiza props.error, getByText debería encontrar 'Error backend'
        expect(screen.getAllByText('Error backend').length).toBeGreaterThan(0);
    });

    // FIX: Ahora que errorBack se pasa correctamente
    test('limpia error backend al escribir', async () => {
        renderWithForm({
            errorBack: { msg: 'Error backend', at: 1 },
        });
        const field = screen.getByTestId('Primer nombre');

        await act(async () => {
            fireEvent.change(field, { target: { value: 'Juan' } });
        });

        // Ahora debería limpiar el error
        expect(screen.queryByText('Error backend')).not.toBeInTheDocument();
    });

    // FIX: Ahora que editDataBasic: true se pasa correctamente
    test('renderiza botones cuando editDataBasic = true', () => {
        renderWithForm({ editDataBasic: true });
        // Se renderizan 2 profile-button (Guardar y Cancelar)
        expect(screen.getAllByTestId('profile-button').length).toBe(2);
    });

    test('renderiza LoadButton cuando editDataBasic = false', () => {
        renderWithForm({ editDataBasic: false });
        expect(screen.getByTestId('loadbutton')).toBeInTheDocument();
    });

    // FIX: Ahora que editDataBasic: true y las funciones se pasan correctamente
    test('ejecuta loadingLineClick y cambia edición al cancelar', async () => {
        const mockLoading = jest.fn().mockResolvedValue(null);
        const mockSetEdit = jest.fn();
        renderWithForm({
            editDataBasic: true,
            loadingLineClick: mockLoading,
            setEditDataBasic: mockSetEdit,
        });
        // El botón 'Cancelar' se renderiza cuando editDataBasic es true
        const cancelButton = screen.getByText('Cancelar');

        await act(async () => {
            fireEvent.click(cancelButton);
        });

        // Esperamos que se llame la función de click del LoadButton/ProfileButtomForm
        expect(mockLoading).toHaveBeenCalled();
        // Esperamos que se llame la función para cambiar el modo de edición
        expect(mockSetEdit).toHaveBeenCalled();
    });

    test('select Sexo funciona correctamente', async () => {
        renderWithForm({ editDataBasic: true });
        const sexSelect = screen.getByTestId('Sexo');

        await act(async () => {
            fireEvent.change(sexSelect, { target: { value: 'F' } });
        });

        expect(sexSelect).toHaveValue('F'); // Usamos toHaveValue en lugar de .value
    });
});
