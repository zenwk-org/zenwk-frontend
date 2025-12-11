import { UserMessages } from '@app/lib/modules/user/constants/user-messages';

import Link from 'next/link';
import Text from '@app/app/(dashboard)/user/ui/user-feed/Text';
import LotusIcon from '@app/components/ui/icons/LotusIcon';

/**
 * Componente del footer para layout de usuario autenticado.
 * @returns
 */
const Footer = ({ style }: { style?: React.CSSProperties }) => {
    return (
        <footer className="bg-white dark:bg-gray-900">
            <div className="grid grid-cols-2 gap-10 p-2 py-5" style={style}>
                {/** Columna 1 */}
                <div className="flex items-center justify-self-end text-sm text-gray-600">
                    <ul className="divide-g flex items-center divide-x divide-gray-400">
                        <li className="px-2">
                            <Text
                                sizeOffset={-17}
                                text={
                                    <div className="flex items-center justify-center">
                                        <LotusIcon width={10} sizeStroke={10} />
                                        <span
                                            className={`px-[0.1rem] font-[350] text-black`}
                                        >
                                            <label
                                                className={`font-[350] text-[#5280DA]`}
                                            >
                                                {
                                                    UserMessages.header.logo
                                                        .zUpperCase
                                                }
                                            </label>
                                            {UserMessages.header.logo.enwk}
                                        </span>
                                    </div>
                                }
                            />
                        </li>
                        <li className="px-2">
                            <Link href="#" className="">
                                <Text
                                    sizeOffset={-13}
                                    text={
                                        <span
                                            className={`block cursor-pointer text-center font-[350] tracking-tighter text-gray-900 hover:text-[#2D64D2]`}
                                        >
                                            {UserMessages.footer.policies}
                                        </span>
                                    }
                                />
                            </Link>
                        </li>
                        <li className="px-2">
                            <Link href="#" className="">
                                <Text
                                    sizeOffset={-13}
                                    text={
                                        <span
                                            className={`block cursor-pointer text-center font-[350] tracking-tighter text-gray-900 hover:text-[#2D64D2]`}
                                        >
                                            {UserMessages.footer.conditions}
                                        </span>
                                    }
                                />
                            </Link>
                        </li>
                    </ul>
                </div>

                {/** Columna 2 */}
                <div className="flex items-center justify-self-start text-sm text-gray-600">
                    <ul className="flex items-center divide-x divide-gray-300">
                        <li className="px-2">
                            <Text
                                sizeOffset={-17}
                                text={
                                    <span
                                        className={`font-[350] tracking-tighter text-gray-700`}
                                    >
                                        {UserMessages.footer.copyrigth}
                                    </span>
                                }
                            />
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
