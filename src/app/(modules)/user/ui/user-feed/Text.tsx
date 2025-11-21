import GenerateBaseText from '@user/components/general/GenerateBaseText';

const Text = ({
    text,
    sizeOffset = 0,
    className = 'text-gray-500',
}: {
    text: React.ReactNode;
    sizeOffset?: number;
    className?: string;
}) => {
    const baseSizes = {
        base: 0.72,
        sm: 0.76,
        md: 0.8,
        lg: 0.84,
        xl: 0.88,
    };

    // ext-[0.72rem] text-gray-500 sm:text-[0.76rem] md:text-[0.8rem] lg:text-[0.84rem] xl:text-[0.88rem] dark:text-white">

    return (
        <GenerateBaseText
            text={text}
            baseSizes={baseSizes}
            sizeOffset={sizeOffset}
            className={className}
        />
    );
};

export default Text;
