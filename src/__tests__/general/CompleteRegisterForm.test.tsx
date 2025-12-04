import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CompleteRegisterForm from '@app/app/(modules)/user/ui/forms/CompleteRegisterForm';
import * as personUtils from '@user/utils/personUtils';
import * as fetchApi from '@app/helpers/fetch-api';
import * as useSexContext from '@app/app/(modules)/user/utils/UseSexOptionsContext';
import * as usePersonContext from '@app/app/(modules)/user/utils/UsePersonContext';
import * as useUserContext from '@app/app/(modules)/user/utils/UseUserContext';

jest.mock('@user/components/forms/CompleteRegisterFormFields', () => ({
    __esModule: true,
    default: jest.fn(({ onSubmit }) => (
        <button onClick={onSubmit}>Submit</button>
    )),
}));

jest.mock('@user/utils/personUtils');
jest.mock('@app/helpers/fetch-api');
jest.mock('@app/app/(modules)/user/utils/UseSexOptionsContext');
jest.mock('@app/app/(modules)/user/utils/UsePersonContext');
jest.mock('@app/app/(modules)/user/utils/UseUserContext');

describe('CompleteRegisterForm', () => {
    const setIsCreatePerson = jest.fn();
    const setEditDataBasic = jest.fn();
    const setLineLoading = jest.fn();
    const setBtnUpdate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useSexContext.useSexOptionsContext as jest.Mock).mockReturnValue({
            optionsSex: [
                { id: 1, label: 'Male' },
                { id: 2, label: 'Female' },
            ],
        });

        (usePersonContext.usePersonContext as jest.Mock).mockReturnValue({
            person: { id: 1 },
            setPerson: jest.fn(),
        });

        (useUserContext.useUserContext as jest.Mock).mockReturnValue({
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
        (useUserContext.useUserContext as jest.Mock).mockReturnValue({
            userDTO: { id: 10 },
            setUserDTO: jest.fn(),
        });

        (usePersonContext.usePersonContext as jest.Mock).mockReturnValue({
            person: { id: 1 },
            setPerson: jest.fn(),
        });

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
            expect(screen.getByText('Submit')).toBeInTheDocument();
        });
    });
});
