import React from "react";

interface Props {
    size?: number;
    sizeStroke?: number;
    className?: string;
}

const BrainIcon = ({ size = 24, sizeStroke = 1.5, className = "" }: Props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={sizeStroke}
            className={className}
            width={size}
            height={size}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 4.5a2.5 2.5 0 00-2.5 2.5v1.25a2.5 2.5 0 000 5V15a2.5 2.5 0 002.5 2.5m0-13h.5a2.5 2.5 0 012.5 2.5v11a2.5 2.5 0 01-2.5 2.5h-.5m0-16V2.75m0 18.5V21m8-16.5a2.5 2.5 0 012.5 2.5v1.25a2.5 2.5 0 010 5V15a2.5 2.5 0 01-2.5 2.5m0-13h-.5a2.5 2.5 0 00-2.5 2.5v11a2.5 2.5 0 002.5 2.5h.5m0-16V2.75m0 18.5V21"
            />
        </svg>
    );
};

export default BrainIcon;
