import clsx from 'clsx';

interface Props {
    content?: React.ReactNode;
    bgColor?: string;
}

/**
 * Pie de página reutilizable que permite insertar contenido personalizado y color de fondo.
 *
 * @param content Elemento JSX que se mostrará dentro del pie de página.
 * @param bgColor Clases Tailwind opcionales para personalizar el fondo.
 */
const Footer = ({ content, bgColor }: Props) => {
    const styleFooter = clsx(
        'flex items-center justify-center px-6 py-4',
        bgColor
    );

    return <footer className={styleFooter}>{content}</footer>;
};

export default Footer;
