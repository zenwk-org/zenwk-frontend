import { UserMessages } from '@app/lib/modules/user/constants/user-messages';

import LotusIcon from '@app/components/ui/icons/LotusIcon';
import Tooltip from '@app/shared/ui/Tooltip';
import Link from 'next/link';
import Text from '@app/app/(dashboard)/user/ui/user-feed/Text';

/**
 * Logo de de la aplicación (zenwk).
 * @returns
 */
const LogoZenwk = ({
    isToolTip = true,
    viewText = true,
}: {
    isToolTip?: boolean;
    viewText?: boolean;
}) => {
    return (
        <Link href="/">
            <div className="group relative drop-shadow-md select-none">
                <Text
                    sizeOffset={30}
                    text={
                        <div
                            className={`flex items-center ${isToolTip && 'cursor-pointer'}`}
                        >
                            <LotusIcon className="mr-[0.1rem]" width={30} />
                            {viewText && (
                                <>
                                    <span
                                        className={`font-[400] text-[#5280DA]`}
                                        style={{
                                            filter: 'drop-shadow(0px 2px 1px rgba(196,112,160,0))',
                                        }}
                                    >
                                        {UserMessages.header.logo.zUpperCase}
                                    </span>
                                    <span
                                        className={`font-[400] text-[#000000]`}
                                        style={{
                                            filter: 'drop-shadow(0px 2px 1px rgba(86,108,123,0))',
                                        }}
                                    >
                                        {UserMessages.header.logo.enwk}
                                    </span>
                                </>
                            )}
                        </div>
                    }
                />

                {isToolTip && (
                    <Tooltip position="right" hiddenArrow={true}>
                        {UserMessages.messageToolTip.start}
                    </Tooltip>
                )}
            </div>
        </Link>
    );
};

export default LogoZenwk;
