import { TEXT_VIOLET_REDDISH_HOVER } from '@/styles/constans-color';

const FolderRootIcon = ({
    className = `${TEXT_VIOLET_REDDISH_HOVER} text-[#135CDC] cursor-pointer`,
    sizeStroke = 2,
    size = 24,
}: {
    className?: string;
    sizeStroke?: number;
    size?: number;
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={sizeStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        <circle cx="12" cy="13" r="2" />
        <path d="M12 15v5" />
    </svg>
);

export default FolderRootIcon;
