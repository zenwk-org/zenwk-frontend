import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CompleteRegisterForm from '@user/ui/forms/CompleteRegisterForm';

// Importaciones de módulos (la clave para usar spyOn)
import * as personUtils from '@user/utils/personUtils';
import * as fetchApi from '@app/helpers/fetch-api';

// Módulos de Contexto: Usamos import * as para espiarlos (spyOn)
import * as useSexContext from '@user/utils/UseSexOptionsContext';
import * as usePersonContext from '@user/utils/UsePersonContext';
import * as useUserContext from '@user/utils/UseUserContext';

// -----------------------------------------------------
// MOCKS ESTATICO (Funciona en CI)
// -----------------------------------------------------

// El mock para el componente hijo que contiene los campos (esto no da problemas de alias)
jest.mock('@user/components/forms/CompleteRegisterFormFields', () => ({
    __esModule: true,
    default: jest.fn(({ onSubmit }) => (
        <button onClick={onSubmit}>Submit</button>
    )),
}));

// Mocks para módulos sin hooks (estos suelen ser seguros)
jest.mock('@user/utils/personUtils');
jest.mock('@app/helpers/fetch-api');

// -----------------------------------------------------
// ELIMINAMOS los jest.mock() para los hooks para evitar el error de alias
// ya que los estamos espiando (spyOn)
// -----------------------------------------------------
// Eliminado: jest.mock('@user/utils/UseSexOptionsContext');
// Eliminado: jest.mock('@user/utils/UsePersonContext');
// Eliminado: jest.mock('@user/utils/UseUserContext');

describe('CompleteRegisterForm', () => {
    const setIsCreatePerson = jest.fn();
    const setEditDataBasic = jest.fn();
    const setLineLoading = jest.fn();
    const setBtnUpdate = jest.fn();

    // SPY ON los hooks en el beforeEach para asegurar que estén mockeados antes de cada test
    beforeEach(() => {
        jest.clearAllMocks();

        // **USAMOS spyOn EN LUGAR DE mock()** para el contexto de sexo
        jest.spyOn(
            useSexContext,
            'useSexOptionsContext' as any
        ).mockReturnValue({
            optionsSex: [
                { id: 1, label: 'Male' },
                { id: 2, label: 'Female' },
            ],
        });

        // **USAMOS spyOn EN LUGAR DE mock()** para el contexto de persona
        jest.spyOn(usePersonContext, 'usePersonContext' as any).mockReturnValue(
            {
                person: { id: 1 },
                setPerson: jest.fn(),
            }
        );

        // **USAMOS spyOn EN LUGAR DE mock()** para el contexto de usuario
        jest.spyOn(useUserContext, 'useUserContext' as any).mockReturnValue({
            userDTO: { id: 10 },
            setUserDTO: jest.fn(),
        });
    });

    test('renders and submits form for creating person', async () => {
        (personUtils.updateOrCreatePerson as jest.Mock).mockResolvedValue({
            id: 1,
        });
        (personUtils.getPerson as jest.Mock).mockResolvedValue({ id: 1 });
        (personUtils.getPathId as jest.Mock).mockReturnValue(1);
        (fetchApi.fetchJwtBaseApi as jest.Mock).mockResolvedValue({});

        render(
            <CompleteRegisterForm
                setIsCreatePerson={setIsCreatePerson}
                setEditDataBasic={setEditDataBasic}
                setLineLoading={setLineLoading}
                setBtnUpdate={setBtnUpdate}
            />
        );

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(personUtils.updateOrCreatePerson).toHaveBeenCalled();
            expect(fetchApi.fetchJwtBaseApi).toHaveBeenCalled();
            expect(setIsCreatePerson).toHaveBeenCalledWith(true);
            expect(setLineLoading).toHaveBeenCalledWith(false);
            expect(setBtnUpdate).toHaveBeenCalledWith(false);
        });
    });

    test('handles editDataBasic path', async () => {
        // Los mocks de contexto ya están definidos en beforeEach

        (personUtils.updateOrCreatePerson as jest.Mock).mockResolvedValue({});
        (personUtils.getPerson as jest.Mock).mockResolvedValue({ id: 1 });

        render(
            <CompleteRegisterForm
                setEditDataBasic={setEditDataBasic}
                editDataBasic={true}
            />
        );

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(personUtils.updateOrCreatePerson).toHaveBeenCalled();
            expect(setEditDataBasic).toHaveBeenCalledWith(false);
        });
    });

    test('handles API errors', async () => {
        const error = new Error('API failed');
        (personUtils.updateOrCreatePerson as jest.Mock).mockRejectedValue(
            error
        );

        render(<CompleteRegisterForm setIsCreatePerson={setIsCreatePerson} />);

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            // El componente debe renderizar algo, en este caso, el botón de submit,
            // y no debe llamar a setIsCreatePerson(true)
            expect(screen.getByText('Submit')).toBeInTheDocument();
            expect(setIsCreatePerson).not.toHaveBeenCalled();
        });
    });
});
