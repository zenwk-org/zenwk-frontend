import clsx from 'clsx';
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

import Text from '../user-feed/Text';
import Tooltip from '@app/shared/ui/Tooltip';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder: string;
    isError?: boolean;
    children: React.ReactNode;
    text?: string;
    minWidth?: number;
    variant?: 'default' | 'verified'; // 👈 Nuevo prop
    type?: string;
    fullWidth?: boolean;
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

        const containerClass = clsx(
            'relative',
            'rounded-lg',
            'has-[input:focus-within]:shadow-sm',
            'has-[input:focus-within]:ring-1',
            'has-[input:focus-within]:outline-1',
            'has-[input:focus-within]:-outline-offset-1',
            isError
                ? 'has-[input:focus-within]:ring-red-200 has-[input:focus-within]:outline-[#e77b73]'
                : variant === 'verified'
                  ? 'has-[input:focus-within]:ring-indigo-200 has-[input:focus-within]:outline-indigo-400'
                  : 'has-[input:focus-within]:ring-blue-100 has-[input:focus-within]:outline-[#9FB0BC]'
        );

        const inputClass = clsx(
            'block rounded-lg border-[1px] bg-white px-4 py-[0.33rem] text-xs focus:outline-none',
            fullWidth
                ? 'w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg'
                : `w-fit max-w-full min-w-[${minWidth}px]`,
            isError
                ? 'text-[#E77B73] placeholder:text-[#E77B73]'
                : 'text-gray-500 placeholder:text-gray-400',
            variant === 'verified' &&
                !isError &&
                'border-indigo-400 text-indigo-700 placeholder:text-indigo-400'
        );

        const borderColor = isError
            ? ERROR_COLOR
            : variant === 'verified'
              ? '#818CF8'
              : BORDER_COLOR; // indigo-400
        const textColor = isError
            ? ERROR_COLOR
            : variant === 'verified'
              ? '#3730A3'
              : BASE_TEXT_COLOR; // indigo-800

        return (
            <div>
                {text && (
                    <Text
                        text={text}
                        sizeOffset={-3}
                        className={`mt-[0.6rem] mb-[0.4rem] ${
                            isError && TEXT_ROSA_COLOR
                        } ${variant === 'verified' && 'flex w-fit items-center rounded-lg bg-indigo-100 px-[0.3rem] font-[450]'} ${variant === 'verified' && !isError} && 'text-black'`}
                    />
                )}
                <div className={containerClass}>
                    <input
                        ref={ref}
                        type={getInputType()}
                        {...props}
                        className={inputClass}
                        placeholder={placeholder}
                        style={{
                            borderColor: borderColor,
                            minWidth: `${minWidth}px`,
                        }}
                        onCut={handleCut}
                        onPaste={handlePaste}
                        onKeyDown={handleKeyDown}
                    />
                    {/** Si el input es tipo password se habilita el botón ver / ocultar password */}
                    {type === 'password' && (
                        <button
                            type="button"
                            className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                            onClick={togglePassword}
                        >
                            <div className="group relative">
                                {showPassword ? (
                                    <EyeOff
                                        className={` ${isError ? 'text-[#E77B73]' : variant === 'verified' ? 'text-indigo-500' : 'text-gray-500 hover:text-gray-700'} `}
                                        size={15}
                                    />
                                ) : (
                                    <Eye
                                        className={` ${isError ? 'text-[#E77B73]' : variant === 'verified' ? 'text-indigo-500' : 'text-gray-500 hover:text-gray-700'} `}
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
