import React from 'react';

/**
 * Componente para el label de las paginas completamente informativas.
 * @param title
 * @returns
 */
const LabelPageInfo = ({ text }: { text: React.ReactNode }) => {
    return (
        <h3 className="my-5 px-4 text-justify font-light text-gray-500 md:text-[1.1rem] lg:text-[1.2rem] xl:text-[1.3rem]">
            {text}
        </h3>
    );
};

export default LabelPageInfo;
