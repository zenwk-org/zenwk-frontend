interface Props {
    text: React.ReactNode;
}

/**
 * Componente general para los subtitulos.
 * @param title
 * @returns
 */
const SubTitle = ({ text }: Props) => {
    return (
        <h3 className="my-5 px-4 text-center text-[1.1rem] font-light text-gray-500">
            {text}
        </h3>
    );
};

export default SubTitle;
