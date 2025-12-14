import { useEffect, useState } from 'react';
import ProfileButtonForm from '@components/modules/user/profile/ProfileButtonForm';
import ConfirmModalDelete from '@/components/shared/common/ConfirmModalDelete';
import { UserMessages } from '@/lib/modules/user/constants/user-messages';

const DeleteAccount = () => {
    const [confirm, setConfirm] = useState(false);
    const [launchModal, setLaunchModal] = useState(false);

    /**
     * Se ejecuta cuando el hijo hace uso de setConfirm
     */
    useEffect(() => {
        if (confirm) {
            deleteAccount();
        }
    }, [confirm]);

    /**
     * Método para la elminación del cuenta.
     */
    const deleteAccount = () => {
        console.log('...deleteAccount...', confirm);
        if (confirm) {
            console.log('Iniciando la eliminación de la cuenta ... ');
        }
    };

    return (
        <div className="flex place-items-center justify-center rounded-2xl bg-blue-50/90 p-6">
            <button onClick={() => setLaunchModal((prev) => !prev)}>
                <ProfileButtonForm
                    classColor="yellow"
                    icon={null}
                    shape="square"
                    nameButtom={
                        UserMessages.profileConfiguration.sections.deleteAccount
                            .btnTitle
                    }
                />
            </button>
            {/* Modal de confirmación */}
            {launchModal && (
                <ConfirmModalDelete
                    setLaunchModal={setLaunchModal}
                    setConfirm={setConfirm}
                    titleText={
                        UserMessages.profileConfiguration.sections.deleteAccount
                            .description
                    }
                    btConfirmText="Eliminar definitivamente"
                />
            )}
        </div>
    );
};
export default DeleteAccount;
