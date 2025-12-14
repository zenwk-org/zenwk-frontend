import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CompleteRegisterForm from '@/components/ui/forms/CompleteRegisterForm';

// Importaciones de módulos (la clave para usar spyOn)
import * as personUtils from '@/lib/modules/user/utils/personUtils';
import * as fetchApi from '@/lib/shared/utils/fetchApi';

// Módulos de Contexto: Usamos import * as para espiarlos (spyOn)
import * as useSexContext from '@/hooks/modules/user/useGenderOptionsContext';
import * as usePersonContext from '@/hooks/modules/user/usePersonContext';
import * as useUserContext from '@/hooks/modules/user/useUserContext';

// -----------------------------------------------------
// MOCKS ESTATICO (Funciona en CI)
// -----------------------------------------------------

// El mock para el componente hijo que contiene los campos (esto no da problemas de alias)
jest.mock('@/components/modules/user/forms/CompleteRegisterFormFields', () => ({
    __esModule: true,
    default: jest.fn(({ onSubmit }) => (
        <button onClick={onSubmit}>Submit</button>
    )),
}));

// Mocks para módulos sin hooks (estos suelen ser seguros)
jest.mock('@/lib/modules/user/utils/personUtils');
jest.mock('@/lib/shared/utils/fetchApi');

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
            'useGenderOptionsContext' as any
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
