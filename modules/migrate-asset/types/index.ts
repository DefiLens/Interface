import { iUserTokenInfo } from "../../../store/Portfolio";

export type tMigrateAsset = {
    isUsersTokenLoading: boolean
    smartAccountAddress: string;
    userTokensData: iUserTokenInfo[];
    scwTokenAddressesData: string[]
    eoaTokenAddressesData: string[]
    checkTokensData:(data: iUserTokenInfo) => void;
};