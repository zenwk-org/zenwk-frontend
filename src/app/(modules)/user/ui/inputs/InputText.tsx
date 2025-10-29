import clsx from 'clsx';
import React from 'react';
import { forwardRef } from 'react';
import {
    ERROR_COLOR,
    BASE_TEXT_COLOR,
    BORDER_COLOR,
    TEXT_ROSA_COLOR,
} from '@app/styles/constans-color';
import { Eye, EyeOff } from 'lucide-react';
import { AuthMessages } from '@auth/constants/auth-messages';
import { usePasswordToggle } from '@app/shared/hooks/usePasswordToggle';
import { useResponsiveStyle } from '@app/shared/hooks/useResponsiveTextAndDimensions';

import Text from '../user-feed/Text';
import Tooltip from '@app/shared/ui/Tooltip';

export const COLOR_EDIT_PERSON = '#F3D068';
export const COLOR_FOCUS_EDIT_PERSON = '#A6B3FD';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder: string;
    isError?: boolean;
    children: React.ReactNode;
    text?: string;
    minWidth?: number;
    variant?: 'default' | 'verified' | 'editPerson';
    type?: string;
    fullWidth?: boolean;
    sizeText?: number;
    inputClass?: string;
    sizeTextInput?: number;
}

const InputText = forwardRef<HTMLInputElement, Props>(
    (
        {
            children,
            placeholder,
            isError,
            text,
            minWidth = 120,
            variant = 'default',
            type = 'text',
            fullWidth = false,
            sizeText = -3,
            inputClass = 'block rounded-lg border-[1px] bg-white px-4 py-[0.33rem] text-xs focus:outline-none',
            sizeTextInput = 0,
            ...props
        },
        ref
    ) => {
        const {
            showPassword,
            togglePassword,
            getInputType,
            handleKeyDown,
            handlePaste,
            handleCut,
        } = usePasswordToggle(type);
        const { fontSize } = useResponsiveStyle();

        const containerClass = clsx(
            'relative',
            'rounded-lg',
            'has-[input:focus-within]:shadow',
            //'has-[input:focus-within]:ring-1',
            //'has-[input:focus-within]:outline-1',
            'has-[input:focus-within]:-outline-offset-1',
            isError
                ? 'has-[input:focus-within]:ring-red-300 has-[input:focus-within]:outline-[#E1564C]'
                : variant === 'verified'
                  ? 'has-[input:focus-within]:ring-indigo-200 has-[input:focus-within]:outline-indigo-400'
                  : variant === 'editPerson'
                    ? 'has-[input:focus-within]:ring-[#A6B3FD] has-[input:focus-within]:outline-[#A6B3FD]'
                    : 'has-[input:focus-within]:ring-blue-100 has-[input:focus-within]:outline-[#9FB0BC]'
        );

        const inputClassLocal = clsx(
            inputClass,
            'block w-full focus:outline-none',
            fullWidth ? 'w-full' : `w-fit min-w-[${minWidth}px]`,
            isError
                ? 'border-[#E77B73] text-[#E77B73] shadow placeholder:text-[#E77B73] focus:border-[#E77B73] focus:ring-[0.03rem] focus:ring-[#E77B73]/80'
                : 'text-[#747B8B] placeholder:text-[#A2A8B4]',
            variant === 'verified' &&
                !isError &&
                'border-indigo-400 text-indigo-700 placeholder:text-indigo-400',
            variant === 'editPerson' &&
                !isError &&
                'border-[#F3D068] transition-colors focus:text-[#A6B3FD] focus:placeholder:text-[#A6B3FD]',
            variant === 'default' &&
                !isError &&
                'border-[#d1d5dc] transition-colors focus:border-[#B7C1C9]'
        );

        const borderColor = isError
            ? ERROR_COLOR
            : variant === 'verified'
              ? '#818CF8'
              : variant === 'editPerson'
                ? '#F3D068'
                : BORDER_COLOR;

        const textColor = isError
            ? ERROR_COLOR
            : variant === 'verified'
              ? '#3730A3'
              : BASE_TEXT_COLOR;

        return (
            <div>
                <div className="px-1 py-2">
                    {text && (
                        <Text
                            text={text}
                            sizeOffset={sizeText}
                            className={`${
                                isError && TEXT_ROSA_COLOR
                            } ${variant === 'verified' && 'flex w-fit items-center rounded-lg bg-indigo-100 px-[0.3rem] font-[450]'} ${variant === 'verified' && !isError} `}
                        />
                    )}
                </div>
                <div className={containerClass}>
                    <input
                        ref={ref}
                        type={getInputType()}
                        {...props}
                        className={inputClassLocal}
                        placeholder={placeholder}
                        style={
                            {
                                // borderColor,
                                //color: textColor,
                                minWidth: `${minWidth}px`,
                                fontSize: `calc(${fontSize} + ${sizeTextInput}rem)`,
                            } as React.CSSProperties
                        }
                        onCut={handleCut}
                        onPaste={handlePaste}
                        onKeyDown={handleKeyDown}
                    />
                    {type === 'password' && (
                        <button
                            type="button"
                            className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                            onClick={togglePassword}
                        >
                            <div className="group relative">
                                {showPassword ? (
                                    <EyeOff
                                        className={` ${
                                            isError
                                                ? 'text-[#E77B73]'
                                                : variant === 'verified'
                                                  ? 'text-indigo-500'
                                                  : 'text-gray-500 hover:text-gray-700'
                                        } `}
                                        size={15}
                                    />
                                ) : (
                                    <Eye
                                        className={` ${
                                            isError
                                                ? 'text-[#E77B73]'
                                                : variant === 'verified'
                                                  ? 'text-indigo-500'
                                                  : 'text-gray-500 hover:text-gray-700'
                                        } `}
                                        size={15}
                                    />
                                )}
                                <Tooltip>
                                    {showPassword
                                        ? AuthMessages.tooltip.hidePassword
                                        : AuthMessages.tooltip.showPassword}
                                </Tooltip>
                            </div>
                        </button>
                    )}
                </div>
                {children}
            </div>
        );
    }
);

export default InputText;
