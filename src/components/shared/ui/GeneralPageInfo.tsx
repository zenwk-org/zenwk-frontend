import OpenMailbox from '@/components/modules/auth/common/OpenMailbox';
import Tooltip from '@/components/shared/ui/Tooltip';
import Text from '@/components/shared/common/Text';
import { UserMessages } from '@/lib/modules/user/constants/user-messages';

interface Props {
    title?: string;
    infoText: React.ReactNode;
    helloText: string;
    keyWord: string;
    icon?: React.ReactNode;
    onBack?: () => void;
}

/**
 *
 * @param param0
 * @returns
 */

const GeneralPageInfo = ({
    title,
    infoText,
    helloText,
    keyWord,
    icon,
    onBack,
}: Props) => {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 pt-12">
            <div className="mx-auto w-full max-w-[250px] place-items-center py-5 sm:max-w-[450px]">
                <div className="flex w-full cursor-pointer items-center justify-center gap-4">
                    <button
                        className="group relative rounded-lg bg-gray-200 px-2 py-1 hover:bg-gray-300"
                        onClick={onBack}
                    >
                        {icon}
                        <Tooltip position="top" hiddenArrow={true}>
                            {UserMessages.messageToolTip.back}
                        </Tooltip>
                    </button>
                    <Text
                        text={title}
                        className="my-2 text-center text-black"
                        sizeOffset={80}
                    />
                </div>

                <div className="grid items-center">
                    <div className="mt-5 mb-2 max-w-prose text-center">
                        <Text
                            sizeOffset={25}
                            text={
                                <>
                                    {helloText}
                                    <span className="text-[#5280DA]">
                                        {keyWord}
                                    </span>
                                    {infoText}
                                </>
                            }
                            className="text-gray-500"
                        />
                    </div>
                </div>

                <div className="grid justify-center">
                    <OpenMailbox typeStyle="loginOpt" />
                </div>
            </div>
        </div>
    );
};

export default GeneralPageInfo;
