import { MailCheck } from 'lucide-react';
import Text from '@/components/shared/common/Text';

interface Props {
    /** Texto que se mostrará en el campo deshabilitado */
    text: string;
}

/**
 * Componente InputDisabled
 *
 * Muestra un campo visualmente deshabilitado con un ícono de usuario y un texto proporcionado.
 *
 * @param text - Texto que se mostrará junto al ícono.
 * @returns JSX.Element
 */
const InputDisabled = ({ text }: Props) => {
    return (
        <Text
            className="mb-5 justify-center rounded-lg border-[0.14rem] border-[#789CE2] px-6 py-1 text-[#5280DA] focus:outline-none"
            text={
                <div className="flex justify-center-safe gap-3">
                    <MailCheck className="!text-[2rem] text-[#5280DA]" />
                    {text}
                </div>
            }
            sizeOffset={10}
        />
    );
};

export default InputDisabled;
