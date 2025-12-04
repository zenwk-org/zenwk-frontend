import React from 'react';
import { Messages } from '@app/shared/constants/messages';

import ButtonOpen from '@app/shared/ui/ButtonOpen';

/**
 * Componente OpenMailbox: Botones para abrir bandejas de correos.
 *
 * @param isSuccessResend - bandera para el envio del correo.
 * @returns - JSX Component.
 */
const OpenMailbox = ({
    typeStyle,
    className = 'flex w-auto', // para que centre completamente
}: {
    typeStyle?: 'profileConfiguration' | 'default' | 'loginOpt' | 'other';
    className?: string;
}) => {
    return (
        <div className={className}>
            <ul className="flex items-center space-x-2">
                <li>
                    <ButtonOpen
                        href="https://mail.google.com"
                        text={Messages.commons.gmail}
                        typeStyle={typeStyle}
                    />
                </li>
                <li>
                    <ButtonOpen
                        href="https://outlook.live.com/mail"
                        text={Messages.commons.outlook}
                        typeStyle={typeStyle}
                    />
                </li>
                <li>
                    <ButtonOpen
                        href="https://www.icloud.com/mail"
                        text={Messages.commons.iCloud}
                        typeStyle={typeStyle}
                    />
                </li>
            </ul>
        </div>
    );
};

export default OpenMailbox;
