import { MutableRefObject, useEffect, useRef } from "react";

const useClickOutside = (refs: MutableRefObject<HTMLElement | null>[], callback: () => void) => {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const isOutside = refs.every((ref) => ref.current && !ref.current.contains(event.target as Node));
            if (isOutside) {
                callbackRef.current();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [refs]);
};

export default useClickOutside;
