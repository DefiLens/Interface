import { iUserTokenInfo } from "../../../store/Portfolio";

export type tMigrateAsset = {
    isUsersTokenLoading: boolean;
    smartAccountAddress: string;
    userTokensData: iUserTokenInfo[];
    scwTokenAddressesData: string[];
    eoaTokenAddressesData: string[];
    checkTokensData: (tokenAddress: string) => void;
    handleExecuteMgrateAsset: () => void;
    isSelecteAll: boolean;
    selectAllTokens: (userTokensData: any) => void;
    deselectAllTokens: (tokenAddress: string) => void;

};
