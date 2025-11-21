import React from 'react';
import Button from '@app/app/(modules)/(auth)/ui/Button';
import ButtonLoading from '@app/app/(modules)/(auth)/ui/ButtonLoading';

/**
 * Interface que representa los datos para LoadButttonLoading
 */
interface Props {
    textButton: string;
    textLoading?: string;
    loading: boolean;
    isError?: boolean;
}
/**
 * Componente LoadButttonLoading para la carga del buton.
 * @returns
 */
const LoadButton = React.memo(
    ({ textButton, textLoading, loading, isError }: Props) => {
        return loading ? (
            <ButtonLoading text={textLoading ? textLoading : textButton} />
        ) : (
            <Button isError={isError} type="submit" text={textButton} />
        );
    }
);

export default LoadButton;
