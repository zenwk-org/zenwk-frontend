import clsx from "clsx";

interface Props {
    text: React.ReactNode;
    textColor?: string;
}

/**
 * Componente `LabelLink`
 *
 * Renderiza un `span` estilizado para simular el aspecto de un enlace.
 * Se utiliza generalmente como llamada visual a una acción o navegación.
 *
 * @param text - Texto visible.
 * @param textColor - Clase opcional para el color del texto.
 * @returns Elemento JSX con estilo de enlace.
 */
const LabelLink = ({ text, textColor }: Props) => {
    const styleSpan = clsx(
        "mb-2 inline cursor-pointer font-medium hover:underline",
        textColor
    );

    return <span className={styleSpan}>{text}</span>;
};

export default LabelLink;
