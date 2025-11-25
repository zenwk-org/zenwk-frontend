import clsx from 'clsx';
import LogoZenwk from '@user/components/header/LogoZenwk';

/**
 * Props del componente Header
 *
 * @param content - Contenido opcional que se mostrará a la derecha del encabezado.
 * @param bgColor - Clase de color de fondo opcional para personalizar el encabezado.
 */
interface Props {
    content?: React.ReactNode;
    bgColor?: string;
}

/**
 * Componente Header
 *
 * @param content - Contenido opcional que se muestra a la derecha del encabezado.
 * @param bgColor - Clase de color Tailwind opcional para personalizar el fondo del encabezado.
 */
const Header = ({ content, bgColor }: Props) => {
    const styleHeader = clsx(
        'flex h-12 w-full items-center justify-between px-4 text-white',
        bgColor
    );

    return (
        <div className={styleHeader}>
            <div className="text-2xl font-semibold tracking-wide text-cyan-900">
                {/* Logo on acceso directo a inicio */}
                <LogoZenwk isToolTip={true} viewText={false} />
            </div>

            {content}
        </div>
    );
};

export default Header;
