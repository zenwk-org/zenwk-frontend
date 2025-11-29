interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    isError?: boolean;
}

/**
 * Componente de botón reutilizable.
 *
 * @param text - Texto que se mostrará dentro del botón.
 * @param props - Atributos adicionales que se pasan al elemento `<button>`, como `onClick`, `type`, `disabled`, etc.
 *
 * Este botón tiene estilos definidos para adaptarse a diferentes temas (claro y oscuro)
 */
const Button = ({ text, isError, ...props }: Props) => {
    const buttonClass = isError
        ? 'mb-2 block h-9.5 w-full cursor-no-drop opacity-80 pointer-events-none rounded-lg bg-[#E77B73] px-5 text-center align-middle text-sm font-semibold text-white shadow-sm transition-all duration-150  focus:outline-none focus:ring-2 focus:ring-[#E1564C] focus:ring-offset-1 sm:w-[400px] dark:bg-[#B5423A] dark:hover:bg-[#A33A33] dark:focus:ring-[#F1776E]'
        : 'block h-9.5 w-full cursor-pointer rounded-lg bg-[#789CE2] px-5 text-center align-middle text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#5280DA] focus:outline-none focus:ring-2 focus:ring-[#789CE2] focus:ring-offset-1 sm:w-[400px] dark:bg-[#339989] dark:hover:bg-[#2E887B] dark:focus:ring-[#5CC6B2]';

    return (
        <div className="mt-5">
            <button type="button" {...props} className={buttonClass}>
                {text}
            </button>
        </div>
    );
};

export default Button;
