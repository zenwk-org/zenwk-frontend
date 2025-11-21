import { TEXT_VIOLET_REDDISH_HOVER } from '@app/styles/constans-color';

const ChevronDownIcon = ({
    className = '',
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
        <path d="m6 9 6 6 6-6" />
    </svg>
);

export default ChevronDownIcon;
