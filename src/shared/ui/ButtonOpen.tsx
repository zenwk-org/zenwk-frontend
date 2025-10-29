import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Link from 'next/link';
import clsx from 'clsx';
import Text from '@user/ui/user-feed/Text';

// Define la interfaz de props esperadas por el componente ButtonOpen
interface Props {
    href: string;
    text: string;
    typeStyle?: 'profileConfiguration' | 'default' | 'loginOpt' | 'other'; // puedes ir agregando más
}

/**
 * Componente que renderiza un botón con estilo que abre un enlace en una nueva pestaña.
 * Incluye un ícono de "abrir en nueva ventana" junto al texto.
 *
 * @param href URL del enlace externo que se abrirá
 * @param text Texto descriptivo que se mostrará en el botón
 */
const ButtonOpen = ({ href, text, typeStyle = 'default' }: Props) => {
    // estilos base por defecto
    const baseStyle =
        ' inline-flex items-center gap-1 rounded-lg border-[0.08rem] border-gray-600 px-2 py-1 text-sm hover:border-[#2E887B] hover:text-[#2E887B] sm:text-xs';
    const profileConfiguration =
        ' cursor-pointer inline-flex items-center gap-1 rounded-md border-[0.08rem] border-emerald-700 p-1 hover:border-emerald-900  hover:text-emerald-900 text-emerald-700  hover:bg-[#D1F2DD]';
    const loginOpt =
        'cursor-pointer inline-flex items-center gap-1 rounded-lg p-2 hover:bg-gray-300 bg-gray-200  text-black font-[350]';

    // estilos condicionales según el tipo
    const styleClasses = clsx({
        [baseStyle]: typeStyle === 'default',
        [profileConfiguration]: typeStyle === 'profileConfiguration',
        [loginOpt]: typeStyle === 'loginOpt',
    });

    return (
        <Link
            href={href}
            target="_blank" // Abre el enlace en una nueva pestaña
            rel="noopener noreferrer" // Mejora seguridad y rendimiento al abrir una nueva pestaña
            className={styleClasses}
        >
            {/* Texto del botón */}
            {typeStyle === 'profileConfiguration' ? (
                <Text
                    text={text}
                    sizeOffset={-20}
                    className="cursor-pointer hover:text-emerald-900"
                />
            ) : typeStyle === 'loginOpt' ? (
                <Text
                    text={text}
                    sizeOffset={-5}
                    className="cursor-pointer font-[400]"
                />
            ) : (
                text
            )}

            {/* Ícono que indica que el enlace se abre en una nueva pestaña */}
            <OpenInNewIcon className="!text-[0.9rem]" />
        </Link>
    );
};

export default ButtonOpen;
