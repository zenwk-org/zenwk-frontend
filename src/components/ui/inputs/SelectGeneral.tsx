import React, { CSSProperties, ReactNode } from 'react';
import Select, {
    StylesConfig,
    components,
    DropdownIndicatorProps,
    ClearIndicatorProps,
} from 'react-select';
import {
    ERROR_COLOR,
    BASE_TEXT_COLOR,
    BOLD_ERROR_COLOR,
} from '@app/styles/constans-color';
import { useResponsiveStyle } from '@app/shared/hooks/useResponsiveTextAndDimensions';
import Text from '../user-feed/Text';
import clsx from 'clsx';

export const COLOR_EDIT_PERSON = '#F3D068';
export const COLOR_FOCUS_EDIT_PERSON = '#A6B3FD';

interface IndicatorBaseProps {
    isError?: boolean;
    variant?: 'newUser' | 'editPerson';
}

export interface Option {
    label: string;
    value: string;
}

interface GroupedOption {
    label: string;
    options: Option[];
}

/* Props principales del componente */
interface Props {
    data: Option[];
    placeholder: string;
    optionsLabel: string;
    isError?: boolean;
    value?: Option | null;
    onChange?: (value: Option | null) => void;
    onBlur?: () => void;
    name?: string;
    children?: ReactNode;
    text?: string;
    variant?: 'newUser' | 'editPerson';
    sizeTextInput?: number;
    paramHeigth?: number;
}

/* Estilos de grupo y contadores */
const groupStyles = (isError?: boolean): CSSProperties => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textTransform: 'none',
    gap: '0.6em',
    paddingBottom: '0.6em',
    color: isError ? BOLD_ERROR_COLOR : '#494F5A',
});

//Sonar. Color del borde
const getBorderColor = (
    isError: boolean | undefined,
    isFocused: boolean,
    variant?: 'newUser' | 'editPerson'
): string => {
    if (isError) return ERROR_COLOR;
    if (isFocused)
        return variant === 'editPerson' ? COLOR_FOCUS_EDIT_PERSON : '#B7C1C9';
    return variant === 'editPerson' ? COLOR_EDIT_PERSON : '#CBD5E1';
};

// Sonar. Box shadow del select
const getBoxShadow = (
    isError: boolean | undefined,
    isFocused: boolean
): string => {
    if (isFocused) {
        if (!isError) return '0px 0px 2px 2px rgba(219,234,254,0.4)';
        return '0px 0px 1px 1px rgba(231,123,115,0.4)';
    }
    return 'none';
};

// Sonar. Estilo focus del select
const getTextColor = (
    isFocused: boolean,
    variant?: 'newUser' | 'editPerson'
): string => {
    if (!isFocused) return BASE_TEXT_COLOR;
    return variant === 'editPerson' ? COLOR_FOCUS_EDIT_PERSON : BASE_TEXT_COLOR;
};

// Sonar. Determina color del separador
const getSeparatorColor = (
    isError?: boolean,
    isFocused?: boolean,
    variant?: 'newUser' | 'editPerson'
): string => {
    if (isError) return ERROR_COLOR;
    if (isFocused)
        return variant === 'editPerson' ? COLOR_FOCUS_EDIT_PERSON : '#B7C1C9';
    return variant === 'editPerson' ? COLOR_EDIT_PERSON : '#B7C1C9';
};

// Sonar. Determina color de fondo del option
const getOptionBackgroundColor = (
    isSelected: boolean,
    isFocused: boolean,
    variant?: 'newUser' | 'editPerson'
): string => {
    if (isSelected)
        return variant === 'editPerson' ? COLOR_FOCUS_EDIT_PERSON : '#9EB8EA';
    if (isFocused) return '#E6E8ED';
    return 'transparent';
};

// Sonar. Determina color de texto del option
const getOptionTextColor = (isSelected: boolean, isError?: boolean): string => {
    if (isSelected) return '#fff';
    return isError ? ERROR_COLOR : BASE_TEXT_COLOR;
};

// Sonar. Determina active style
const getOptionActiveBackground = (
    variant?: 'newUser' | 'editPerson'
): string => {
    return variant === 'editPerson' ? COLOR_FOCUS_EDIT_PERSON : '#9EB8EA';
};

// Sonar. Calcula el color del stroke según estado
const getStrokeColor = (
    isError?: boolean,
    isFocused?: boolean,
    variant?: 'newUser' | 'editPerson'
): string => {
    if (isError) return '#E1564C';
    if (isFocused)
        return variant === 'editPerson' ? COLOR_FOCUS_EDIT_PERSON : '#B7C1C9';
    return variant === 'editPerson' ? COLOR_EDIT_PERSON : '#B7C1C9';
};

/**
 * Estilos personalizados react-select
 * @param fontSize
 * @param height
 * @param isError
 * @param variant
 * @param sizeTextInput
 * @returns
 */
const customStyles = (
    fontSize: string,
    height: string,
    isError?: boolean,
    variant?: 'newUser' | 'editPerson',
    sizeTextInput?: number
): StylesConfig<Option, false, GroupedOption> => ({
    control: (provided, state) => {
        const base = {
            ...provided,
            minWidth: '120px',
            minHeight: '25px',
            height,
            width: 'auto',
            borderRadius: '0.5em',
            borderWidth: variant == 'newUser' ? '0.14rem' : '0.13rem',
            borderColor: getBorderColor(isError, state.isFocused, variant),
            boxShadow: getBoxShadow(isError, state.isFocused),
            '&:hover': { borderColor: isError ? ERROR_COLOR : '' },
            backgroundColor: 'transparent',
            // Aquí se aplica estilo al texto dentro del select cuando hay focus
            '& .react-select__single-value': {
                color: getTextColor(state.isFocused, variant),
                transition: 'color 0.2s ease-in-out',
            },
            alignItems: 'center',
        };
        return base;
    },

    placeholder: (p, state) => ({
        ...p,
        color: (() => {
            if (isError) return ERROR_COLOR;
            if (state.isFocused && variant === 'editPerson')
                return COLOR_FOCUS_EDIT_PERSON;
            return '#A2A8B4';
        })(),
        fontSize: `calc(${fontSize} + ${sizeTextInput}rem)`,

        textAlign: variant === 'newUser' ? 'left' : undefined,
        padding: '0 6px',
    }),

    input: (p) => ({
        ...p,
        margin: 0,
        padding: '0 7px',
        color: BASE_TEXT_COLOR,
        fontSize: `calc(${fontSize} + ${sizeTextInput}rem)`,
    }),
    dropdownIndicator: (p) => ({
        ...p,
        alignItems: 'center',
        // color: BASE_TEXT_COLOR,
        padding: '0 6px',
        svg: { width: '14px', height: '14px', transform: 'scale(1.15)' },
    }),
    clearIndicator: (p) => ({
        ...p,
        alignItems: 'center',
        padding: variant === 'newUser' ? '0 4px' : '3px',
        color: BASE_TEXT_COLOR,

        svg: { width: '14px', height: '14px', transform: 'scale(1.15)' },
    }),
    indicatorSeparator: (p, state) => ({
        ...p,
        width: '0.12rem',
        alignItems: 'center',
        height: '50%',
        alignSelf: 'center',
        backgroundColor: getSeparatorColor(isError, state.isFocused, variant),
    }),
    option: (p, state) => ({
        ...p,
        fontSize: `calc(${fontSize} + ${sizeTextInput}rem)`,
        padding: '5px 12px',
        textAlign: 'center',
        // Opciópn seleccionada: color fondo
        backgroundColor: getOptionBackgroundColor(
            state.isSelected,
            state.isFocused,
            variant
        ),
        // Opción seleccionada: color letra
        color: getOptionTextColor(state.isSelected, isError),
        ':active': {
            backgroundColor: getOptionActiveBackground(variant),
            color: '#fff',
        },
        boder: '0',
    }),
    singleValue: (p) => ({
        ...p,
        fontSize: `calc(${fontSize} + ${sizeTextInput}rem)`,
        color: isError ? ERROR_COLOR : BASE_TEXT_COLOR,
        textAlign: 'left',
        padding: '0 6px',
        margin: 0,
        alignContent: 'center',
    }),
    menu: (p) => ({
        ...p,
        zIndex: 9999,

        overflow: 'hidden',
        fontSize: `calc(${fontSize} + ${sizeTextInput}rem)`,
        margin: variant === 'newUser' ? '3px 0 8px 0' : '3px 0 4px 0',
        borderRadius: '1em',
        border: isError ? `${ERROR_COLOR} 2px solid` : 'transparent',
        backgroundColor: '#ffffff',
        boxShadow: isError
            ? '0px 0px 1px 1px rgba(231,123,115,0.4)'
            : '0 8px 16px rgba(0,0,0,0.2)',
    }),

    menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
    }),

    menuList: (p) => ({
        ...p,
        overflowX: 'hidden',
        overflowY: 'auto',
        paddingTop: 0,
        fontSize: `calc(${fontSize} + ${sizeTextInput}rem)`,
        paddingBottom: 0,
        // Para contrarrestar defecto cuando hay desboramiento del body.
        maxHeight: height === '29px' ? '150px' : '200px',
    }),
    groupHeading: (p) => ({
        ...p,
        textTransform: 'none',
        fontSize: '0.98em',
        fontWeight: 600,
        textAlign: 'center',
    }),
});

/**
 * CustomClearIndicator
 * @param param0
 * @returns
 */
const CustomClearIndicator = ({
    isError = false,
    variant,
    ...props
}: ClearIndicatorProps<Option, false, GroupedOption> & IndicatorBaseProps) => (
    <components.ClearIndicator {...props}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke={getStrokeColor(isError, props.isFocused, variant)}
            strokeWidth={2.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={variant === 'editPerson' ? 100 : 0.7}
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    </components.ClearIndicator>
);

/**
 * CustomDropdownIndicator
 * @param param0
 * @returns
 */
const CustomDropdownIndicator = ({
    isError = false,
    variant,
    ...props
}: DropdownIndicatorProps<Option, false, GroupedOption> &
    IndicatorBaseProps) => (
    <components.DropdownIndicator {...props}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={getStrokeColor(isError, props.isFocused, variant)}
            strokeWidth={2.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={variant === 'editPerson' ? 100 : 0.7}
        >
            <circle cx="12" cy="12" r="10" />
            <path d="m16 10-4 4-4-4" />
        </svg>
    </components.DropdownIndicator>
);

/**
 * Formato del encabezado de grupo
 * @param data
 * @param isError
 * @returns
 */
const formatGroupLabel = (
    data: GroupedOption,
    isError?: boolean
): React.JSX.Element => (
    <div style={groupStyles(isError)}>
        <span>{data.label}</span>
    </div>
);

// Sonar. Wrapper para el ícono del dropdown
function createDropdownIndicator(
    isError: boolean | undefined,
    variant: string | undefined
) {
    return function DropdownIndicatorWrapper(props: any) {
        return (
            <CustomDropdownIndicator
                {...props}
                isError={isError}
                variant={variant}
            />
        );
    };
}

// Sonar. Wrapper para el ícono de limpieza (clear)
function createClearIndicator(
    isError: boolean | undefined,
    variant: string | undefined
) {
    return function ClearIndicatorWrapper(props: any) {
        return (
            <CustomClearIndicator
                {...props}
                isError={isError}
                variant={variant}
            />
        );
    };
}

/**
 * Componente TSX principal
 * @param param0
 * @returns
 */
const SelectGeneral: React.FC<Props> = ({
    data,
    optionsLabel,
    placeholder,
    isError,
    value,
    onChange,
    onBlur,
    name,
    children,
    text,
    variant,
    sizeTextInput = 0,
    paramHeigth = 0,
}) => {
    const { fontSize, height } = useResponsiveStyle();
    const numeric = Number.parseFloat(height);
    const result = numeric + paramHeigth;
    const heightCalc = `${result}px`;

    const groupedOptions: GroupedOption[] = [
        { label: optionsLabel, options: data.map((item) => ({ ...item })) },
    ];

    const selectedOption = value
        ? { label: value.label, value: value.value }
        : null;

    // Sonar. Color de texto
    const classTextColor = clsx(
        'mx-1 py-2',
        isError && 'text-[#E1564C]',
        !isError && variant === 'editPerson' && 'text-black',
        !isError && variant !== 'editPerson' && 'text-gray-500'
    );

    // Sonar. Aplicando wrappers
    const components = {
        DropdownIndicator: createDropdownIndicator(isError, variant),
        ClearIndicator: createClearIndicator(isError, variant),
    };
    return (
        <div>
            {text && (
                <Text
                    text={text}
                    sizeOffset={variant === 'newUser' ? 5 : 1}
                    className={classTextColor}
                />
            )}
            <Select<Option, false, GroupedOption>
                classNamePrefix="react-select"
                isSearchable={false}
                options={groupedOptions}
                menuPortalTarget={document.body}
                formatGroupLabel={(data) => formatGroupLabel(data, isError)}
                styles={customStyles(
                    fontSize,
                    heightCalc,
                    isError,
                    variant,
                    sizeTextInput
                )}
                isClearable
                placeholder={placeholder}
                value={selectedOption}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                components={components}
            />
            {children && <div className="mt-1">{children}</div>}
        </div>
    );
};

export default SelectGeneral;
