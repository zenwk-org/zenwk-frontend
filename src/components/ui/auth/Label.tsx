import Text from '@app/app/(dashboard)/user/ui/user-feed/Text';

/**
 * Componente Label
 *
 * Muestra una etiqueta de texto asociada a un campo de formulario.
 *
 * @param text - Contenido del texto a mostrar dentro de la etiqueta. Puede ser texto plano o un nodo React.
 * @returns JSX.Element
 */
const Label = ({ text }: { text: React.ReactNode }) => {
    return (
        <Text
            text={text}
            sizeOffset={5}
            className="mb-2 text-gray-700 sm:w-[400px]"
        />
    );
};

export default Label;
