import Title from '@user/ui/user-feed/Title';
import ChevronDownIcon from '@user/components/icons/ChevronDownIcon';

export const ConfigButton = ({
    text,
    isActive,
    onClick,
}: {
    text: React.ReactNode;
    isActive: boolean;
    onClick?: () => void;
}) => (
    <button
        className="group flex cursor-pointer items-center gap-3"
        onClick={onClick}
    >
        <Title
            sizeOffset={10}
            text={text}
            className={`group-hover:text-black hover:cursor-pointer ${
                isActive ? 'font-[450] text-black' : 'text-gray-800'
            }`}
        />

        <div className="rounded-lg p-3 hover:bg-gray-100">
            <ChevronDownIcon
                size={20}
                sizeStroke={3}
                className={`h-4 w-4 transition-transform duration-300 group-hover:text-black ${
                    isActive ? 'rotate-180 font-[340] text-black' : 'text-black'
                }`}
            />
        </div>
    </button>
);
