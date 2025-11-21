import clsx from 'clsx';
import Text from '@app/app/(modules)/user/ui/user-feed/Text';
import LotusIcon from '@app/app/(modules)/user/components/icons/LotusIcon';
import { UserMessages } from '@app/app/(modules)/user/constants/user-messages';
import Link from 'next/link';

interface Props {
    // content: React.ReactNode;
    bgColor?: string;
}

const Footer = ({ bgColor }: Props) => {
    // Elementos que ancland el footer al extremo de la pantalla:
    // styleFooter: fixed bottom-0
    const styleFooter = clsx(
        'left-0 flex w-full items-center justify-center px-6 py-5',
        bgColor
    );

    return (
        <footer className={styleFooter}>
            <div className="grid grid-cols-2 gap-10">
                {/** Columna 1 */}
                <div className="flex items-center justify-self-end text-sm text-gray-600">
                    <ul className="divide-g flex items-center divide-x divide-gray-300">
                        {/* <li className="px-2">
                            <Text
                                sizeOffset={-2}
                                text={
                                    <div className="flex items-center justify-center">
                                        <LotusIcon width={15} sizeStroke={10} />
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
                        </li> */}
                        <li className="px-2">
                            <Link href="#" className="">
                                <Text
                                    sizeOffset={-10}
                                    text={
                                        <span
                                            className={`block cursor-pointer text-center text-gray-600 hover:text-[#2D64D2]`}
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
                                    sizeOffset={-10}
                                    text={
                                        <span
                                            className={`block cursor-pointer text-center text-gray-600 hover:text-[#2D64D2]`}
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
                    <ul className="flex items-center">
                        <li className="px-2">
                            <Text
                                sizeOffset={-17}
                                text={
                                    <span className={`text-gray-600`}>
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
