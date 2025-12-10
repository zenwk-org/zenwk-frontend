import Text from '@app/app/(dashboard)/user/ui/user-feed/Text';

interface Props {
    title: React.ReactNode;
}

/**
 * Componente general para los titulos.
 * @param title - Contenido del título.
 * @returns Elemento JSX que representa un título.
 */
const Title = ({ title }: Props) => {
    return (
        <Text
            text={title}
            className="my-5 text-center text-black"
            sizeOffset={80}
        />
    );
};

export default Title;
