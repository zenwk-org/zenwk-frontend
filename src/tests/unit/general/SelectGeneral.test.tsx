import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectGeneral from '@/components/ui/inputs/SelectGeneral';

// Mock hook responsivo
jest.mock('@/hooks/shared/useResponsiveTextAndDimensions', () => ({
    useResponsiveStyle: () => ({
        fontSize: '14px',
        height: '28px',
    }),
}));

// Mock <Text> conservando className
jest.mock('@/components/shared/common/Text', () => (props: any) => (
    <div data-testid="text-mock" className={props.className}>
        {props.text}
    </div>
));

describe('SelectGeneral – pruebas completas', () => {
    const data = [
        { label: 'Uno', value: '1' },
        { label: 'Dos', value: '2' },
    ];

    const defaultProps = {
        data,
        optionsLabel: 'Opciones',
        placeholder: 'Seleccione algo',
        sizeTextInput: 0,
        paramHeigth: 0,
    };

    test('Renderiza placeholder y opciones agrupadas', () => {
        const { container } = render(<SelectGeneral {...defaultProps} />);

        expect(screen.getByText('Seleccione algo')).toBeInTheDocument();

        const selectControl = container.querySelector(
            '.react-select__control'
        )!;
        fireEvent.keyDown(selectControl, { key: 'ArrowDown' });

        expect(screen.getByText('Opciones')).toBeInTheDocument();
    });

    test('Renderiza texto superior con Text mockeado', () => {
        render(<SelectGeneral {...defaultProps} text="Mi texto" />);
        expect(screen.getByTestId('text-mock')).toHaveTextContent('Mi texto');
    });

    test('Renderiza children', () => {
        render(
            <SelectGeneral {...defaultProps}>
                <div data-testid="child">Child</div>
            </SelectGeneral>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    test('onChange retorna opción seleccionada', () => {
        const fn = jest.fn();
        const { container } = render(
            <SelectGeneral {...defaultProps} onChange={fn} />
        );

        const control = container.querySelector('.react-select__control')!;
        fireEvent.keyDown(control, { key: 'ArrowDown' });

        fireEvent.click(screen.getByText('Uno'));

        expect(fn.mock.calls[0][0]).toEqual({ label: 'Uno', value: '1' });
    });

    test('onBlur se dispara correctamente', () => {
        const fn = jest.fn();
        const { container } = render(
            <SelectGeneral {...defaultProps} onBlur={fn} />
        );

        const input = container.querySelector('input')!;
        fireEvent.blur(input);

        expect(fn).toHaveBeenCalled();
    });

    test('isError aplica clase roja', () => {
        render(<SelectGeneral {...defaultProps} isError text="Error text" />);

        const t = screen.getByTestId('text-mock');
        expect(t.className).toContain('text-[#E1564C]');
    });

    test('variant=editPerson aplica clase negra', () => {
        render(
            <SelectGeneral {...defaultProps} variant="editPerson" text="txt" />
        );

        const t = screen.getByTestId('text-mock');
        expect(t.className).toContain('text-black');
    });

    test('variant=newUser aplica clase gris', () => {
        render(
            <SelectGeneral {...defaultProps} variant="newUser" text="txt" />
        );

        const t = screen.getByTestId('text-mock');
        expect(t.className).toContain('text-gray-500');
    });

    test('isClearable dibuja ClearIndicator', () => {
        const { container } = render(
            <SelectGeneral
                {...defaultProps}
                value={data[0]}
                isError
                variant="editPerson"
            />
        );

        const clear = container.querySelector('.react-select__clear-indicator');

        expect(clear).not.toBeNull();
    });

    test('DropdownIndicator personalizado se renderiza', () => {
        const { container } = render(
            <SelectGeneral {...defaultProps} variant="editPerson" />
        );

        const dropdown = container.querySelector(
            '.react-select__dropdown-indicator'
        );
        expect(dropdown).not.toBeNull();
    });

    test('value se asigna correctamente', () => {
        render(
            <SelectGeneral
                {...defaultProps}
                value={{ label: 'Dos', value: '2' }}
            />
        );

        expect(screen.getByText('Dos')).toBeInTheDocument();
    });

    test('Cubre wrappers (dropdown y clear)', () => {
        const { container } = render(
            <SelectGeneral
                {...defaultProps}
                value={data[0]}
                isError
                variant="editPerson"
            />
        );

        expect(
            container.querySelector('.react-select__dropdown-indicator')
        ).not.toBeNull();

        expect(
            container.querySelector('.react-select__clear-indicator')
        ).not.toBeNull();
    });

    test('customStyles aplica estilos dinámicos (focus)', () => {
        const { container } = render(<SelectGeneral {...defaultProps} />);

        const input = container.querySelector('input[id$="-input"]');
        expect(input).not.toBeNull();

        const control = container.querySelector('.react-select__control');
        expect(control).not.toBeNull();

        fireEvent.focus(input!);

        expect(
            control!.className.includes('react-select__control--is-focused')
        ).toBe(true);
    });
});
