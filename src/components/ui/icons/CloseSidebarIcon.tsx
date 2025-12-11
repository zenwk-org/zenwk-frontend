const CloseSidebarIcon = ({
    className = ` hover:text-[#5280DA] text-[#135CDC] cursor-pointer`,
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
        style={{ filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0))' }}
    >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M15 3v18" />
        <path d="m10 15-3-3 3-3" />
    </svg>
);

export default CloseSidebarIcon;
