import { useState, useCallback } from "react";

/**
 * Hook para el input type password
 * @param type
 * @param initial
 * @returns
 */
export const usePasswordToggle = (type: string, initial = false) => {
    const [showPassword, setShowPassword] = useState(initial);

    const togglePassword = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const getInputType = useCallback(() => {
        if (type !== "password") return type;
        return showPassword ? "text" : "password";
    }, [type, showPassword]);

    // Bloquea atajos de teclado Ctrl+V / Ctrl+X
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (
                type === "password" &&
                (e.ctrlKey || e.metaKey) &&
                (e.key === "v" || e.key === "x")
            ) {
                e.preventDefault();
            }
        },
        [type]
    );

    // Bloquea pegar con clic derecho o menú
    const handlePaste = useCallback(
        (e: React.ClipboardEvent<HTMLInputElement>) => {
            if (type === "password") e.preventDefault();
        },
        [type]
    );

    // Bloquea cortar
    const handleCut = useCallback(
        (e: React.ClipboardEvent<HTMLInputElement>) => {
            if (type === "password") e.preventDefault();
        },
        [type]
    );

    return {
        showPassword,
        togglePassword,
        getInputType,
        handleKeyDown,
        handlePaste,
        handleCut,
    };
};
