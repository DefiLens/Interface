import { useMutation } from "@tanstack/react-query";

import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iTrading, useTradingStore } from "../../store/TradingStore";

export function useCreateSession() {
    const { smartAccount }: iGlobal = useGlobalStore((state) => state);
    async function createSession() {
        try {
        } catch (error: unknown) {
            return;
        }
    }
    return useMutation(createSession);
}
