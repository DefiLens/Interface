import { useEffect, useRef } from "react";

const useClickOutside = (refs: any, callback: any) => {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        function handleClickOutside(event) {
            const isOutside = refs.every((ref) => ref.current && !ref.current.contains(event.target));
            if (isOutside) {
                callbackRef.current();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [refs]);
};

export default useClickOutside;
