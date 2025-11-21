/**
 * Datos que representa  los parametos usados del Tooltip
 */
type Props = {
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    hiddenArrow?: boolean;
};

const Tooltip = ({
    children,
    position = 'top',
    hiddenArrow = false,
}: Props) => {
    /**
     * Posición de la caja del mensaje
     */
    const positionClasses: Record<typeof position, string> = {
        top: '-top-8 left-1/2 -translate-x-1/2 flex-col',
        bottom: 'top-full mt-2 left-1/2 -translate-x-1/2 flex-col-reverse',
        left: 'right-full mr-2 top-1/2 -translate-y-1/2 flex-row',
        right: 'left-full ml-2 top-1/2 -translate-y-1/2 flex-row-reverse',
    };

    /**
     * Ubicación de la flecha
     */
    const arrowPosition: Record<typeof position, string> = {
        top: 'mt-[-4px] rotate-45',
        bottom: 'mb-[-4px] rotate-45',
        left: 'ml-[-4px] rotate-45',
        right: 'mr-[-4px] rotate-45',
    };

    return (
        <div
            className={`absolute z-10 flex scale-0 items-center transition-transform duration-100 group-hover:scale-100 group-hover:opacity-60 ${positionClasses[position]}`}
        >
            <div className="rounded bg-black px-[0.45rem] py-[0.18rem] text-xs font-[320] tracking-tight whitespace-nowrap text-white">
                {children}
            </div>
            {/** Si se muestra a la derecha o izquierda se quita la flecha */}
            {!hiddenArrow && (
                <div
                    className={`h-2 w-2 bg-black ${arrowPosition[position]}`}
                ></div>
            )}
        </div>
    );
};

export default Tooltip;
