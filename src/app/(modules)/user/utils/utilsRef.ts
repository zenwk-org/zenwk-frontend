import { Ref, RefObject } from "react";

/**
 * La función mergeRefs combina múltiples referencias (refs) de React en una sola. Esto permite
 * asignar un mismo elemento DOM o componente a varias referencias, sean funciones o referencias
 * creadas con useRef. Itera sobre cada referencia, validando si existe, y actualiza su valor
 * actual (current) o ejecuta la función correspondiente. Es útil cuando un componente necesita
 * exponer su referencia a varios consumidores, como integraciones con bibliotecas externas
 * y lógica interna.
 * @param refs
 * @returns
 */
export const mergeRefs = <T>(...refs: (Ref<T> | undefined)[]) => {
    return (element: T) => {
        refs.forEach((ref) => {
            if (!ref) return;

            if (typeof ref === "function") {
                ref(element);
            } else {
                (ref as RefObject<T | null>).current = element;
            }
        });
    };
};
