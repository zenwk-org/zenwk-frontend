import { TEXT_VIOLET_REDDISH_HOVER } from "@app/styles/constans-color";

const CalendarCheckIcon = ({
    className = ` ${TEXT_VIOLET_REDDISH_HOVER} text-[#135CDC] cursor-pointer`,
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
        style={{ filter: "drop-shadow(0px 1px 1px rgba(0,0,0,0))" }}
    >
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
        <path d="m9 16 2 2 4-4" />
    </svg>
);

export default CalendarCheckIcon;
