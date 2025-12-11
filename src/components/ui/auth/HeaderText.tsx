interface Props {
    /** Texto o elemento React que se mostrará como encabezado */
    text: React.ReactNode;
    /** Indica si el texto debe centrarse. Por defecto: true */
    isCenter?: boolean;
}

/**
 * Componente HeaderText
 *
 * Muestra un encabezado de texto con estilos aplicados. Permite alinear el texto al centro u otro según la prop `isCenter`.
 *
 * @param text - Texto o contenido React a mostrar.
 * @param isCenter - Si se alinea el texto al centro o no (true por defecto).
 * @returns JSX.Element
 */
const HeaderText = ({ text, isCenter = true }: Props) => {
    return (
        <h3
            className={`my-5 text-sm font-light break-words text-gray-500 sm:text-sm md:max-w-[860px] md:text-base lg:text-lg xl:text-xl ${
                isCenter && 'text-center'
            }`}
        >
            {text}
        </h3>
    );
};

export default HeaderText;
