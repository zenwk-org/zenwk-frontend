import { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AuthMessages } from '@app/app/(auth)/constants/auth-messages';
import { usePasswordToggle } from '@app/shared/hooks/usePasswordToggle';

import Tooltip from '@app/shared/ui/Tooltip';
import Text from '@app/app/(dashboard)/user/ui/user-feed/Text';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    isError?: boolean;
    children: React.ReactNode;
}

const FormInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const {
        type = 'text',
        isError = false,
        label,
        children,
        placeholder,
        onBlur,
        name,
        onChange,
    } = props;

    const {
        showPassword,
        togglePassword,
        getInputType,
        handleCut,
        handlePaste,
        handleKeyDown,
    } = usePasswordToggle(type);

    return (
        <div className="mb-3">
            <Text
                text={label}
                sizeOffset={5}
                //className="mb-2 font-[350] text-[#D62727] sm:w-[400px] sm:w-[400px]"
                className={`mb-2 sm:w-[400px] ${!isError ? 'text-gray-800' : 'text-[#D62727]'}`}
            />
            <div className="relative h-9 w-full">
                <input
                    className={`h-full w-full rounded-lg border p-2.5 ${
                        type === 'password' && 'pr-8'
                    } sm:w-[400px] ${
                        isError
                            ? 'border-[0.01rem] border-[#F76363] bg-red-50 text-sm text-[#D62727] placeholder:text-[#E67575]'
                            : ':border-[0.1rem] border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-300/60 focus:ring-offset-1 focus:ring-offset-indigo-50'
                    }`}
                    type={getInputType()}
                    placeholder={placeholder}
                    ref={ref}
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
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
                                    className="text-gray-500 hover:text-gray-700"
                                    size={15}
                                />
                            ) : (
                                <Eye
                                    className="text-gray-500 hover:text-gray-700"
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
});

export default FormInput;
