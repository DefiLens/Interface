import { iUserTokenInfo } from "../../../store/Portfolio";

export type tMigrateAsset = {
    isUsersTokenLoading: boolean;
    smartAccountAddress: string;
    userTokensData: iUserTokenInfo[];
    filteredDefiTokens: iUserTokenInfo[];
    scwTokenAddressesData: string[];
    eoaTokenAddressesData: string[];
    checkTokensData: (tokenAddress: string) => void;
    handleExecuteMgrateAsset: () => void;
    isAllErc20Selected: boolean;
    isAllDefiSelected: boolean;
    selectAllTokens: (type: string, userTokensData: any) => void;
};
