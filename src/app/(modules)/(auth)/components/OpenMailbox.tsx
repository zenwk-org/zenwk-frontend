import Label from '@app/app/(modules)/(auth)/ui/Label';
import { useEffect, useState } from 'react';
import Paragraph from '@app/shared/ui/Paragraph';
import ButtonOpen from '@app/shared/ui/ButtonOpen';

import { Messages } from '@app/shared/constants/messages';
import { AuthMessages } from '@auth/constants/auth-messages';
import Text from '@user/ui/user-feed/Text';
import AlertInfo from '@app/shared/components/AlertInfo';

/**
 * Componente OpenMailbox: Botones para abrir bandejas de correos.
 *
 * @param isSuccessResend - bandera para el envio del correo.
 * @returns - JSX Component.
 */
const OpenMailbox = ({
    isSuccessResend,
    typeStyle,
    className = '',
}: {
    isSuccessResend: boolean;
    typeStyle?: 'profileConfiguration' | 'default' | 'loginOpt' | 'other';
    className?: string;
}) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 10000); // 10 segundos
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full text-center sm:w-[400px]">
            <Paragraph
                text={
                    <ul className="flex justify-center space-x-2">
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
                }
            />
        </div>
    );
};

export default OpenMailbox;
