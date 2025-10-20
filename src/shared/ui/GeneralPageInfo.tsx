import LablePageInfo from '@auth/ui/LablePageInfo';
import CenteredHeaderWithBack from '@app/app/(modules)/(auth)/components/CenteredHeaderWithBack';
import OpenMailbox from '@auth/components/OpenMailbox';

interface Props {
    title?: string;
    infoText: string;
    helloText: string;
    keyWord: string;
    icon?: React.ReactNode;
    onBack?: () => void;
    children?: React.ReactNode;
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
        <div className="flex min-h-screen items-start justify-center px-4 pt-12">
            <div className="grid w-full max-w-[860px] justify-center">
                <CenteredHeaderWithBack
                    onBack={onBack}
                    icon={icon}
                    title={title}
                />

                <div className="grid justify-center">
                    <div className="max-w-prose text-justify">
                        <LablePageInfo
                            text={
                                <>
                                    {helloText}
                                    <span className="text-cyan-700">
                                        {keyWord}
                                    </span>
                                    {infoText}
                                </>
                            }
                        />
                    </div>
                </div>

                <div className="grid justify-center">
                    <OpenMailbox isSuccessResend={false} />
                </div>
            </div>
        </div>
    );
};

export default GeneralPageInfo;
