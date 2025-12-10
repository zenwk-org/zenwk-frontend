import React from 'react';
import clsx from 'clsx';

/**
 * Buttom cerrar
 * @param param0
 * @returns
 */
const CloseButtom = ({
    handleClose,
    type = 'default',
}: {
    handleClose?: () => void;
    type?: 'default' | 'notification';
}) => {
    const classComponent = clsx(
        'group absolute end-3.5 top-3 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg dark:hover:bg-gray-400 dark:hover:text-white',
        type === 'notification'
            ? 'text-emerald-800 hover:bg-[#C8EFD6]'
            : 'text-black hover:bg-gray-200 hover:text-black'
    );

    return (
        <button type="button" className={classComponent} onClick={handleClose}>
            {/** Icono cerrrar popup */}
            <svg
                className="cursor-pointer"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
                width={11}
                height={11}
            >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
            </svg>
            {/* <Tooltip position="top" hiddenArrow={false}>
        Cerrar modal
    </Tooltip> */}
        </button>
    );
};

export default CloseButtom;
