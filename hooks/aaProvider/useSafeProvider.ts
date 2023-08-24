import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "../../store/appStore";
import { _functionType, _nonce } from "../../utils/constants";
import { toast } from "react-hot-toast";

import { Web3AuthModalPack } from "@safe-global/auth-kit";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Web3AuthOptions } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import { MetaTransactionData, MetaTransactionOptions } from "@safe-global/safe-core-sdk-types";
import AccountAbstraction from "@safe-global/account-abstraction-kit-poc";
import { BigNumber, ethers } from "ethers";
import { MAINNET_WEB3_AUTH } from "../../utils/keys";

export function useSafeProvider() {
    const { smartAccount, setSendtxLoading, setTxHash }: any = useAppStore((state) => state);

    async function sendToSafe(txs) {
        try {
            // console.log('loginWeb3Auth+')
            // console.log(process.env.REACT_APP_WEB3AUTH_CLIENT_ID)
            // console.log(chain.id, chain.rpcUrl)
            const options: Web3AuthOptions = {
                clientId: MAINNET_WEB3_AUTH || "",
                web3AuthNetwork: "mainnet",
                chainConfig: {
                    chainNamespace: CHAIN_NAMESPACES.EIP155,
                    chainId: "0x89",
                    rpcTarget: "https://polygon-rpc.com",
                },
                uiConfig: {
                    theme: "dark",
                    loginMethodsOrder: ["google", "facebook"],
                },
            };

            const modalConfig = {
                [WALLET_ADAPTERS.TORUS_EVM]: {
                    label: "torus",
                    showOnModal: false,
                },
                [WALLET_ADAPTERS.METAMASK]: {
                    label: "metamask",
                    showOnDesktop: true,
                    showOnMobile: false,
                },
            };

            const openloginAdapter: any = new OpenloginAdapter({
                loginSettings: {
                    mfaLevel: "mandatory",
                },
                adapterSettings: {
                    uxMode: "popup",
                    whiteLabel: {
                        name: "Safe",
                    },
                },
            });

            const web3AuthModalPack = new Web3AuthModalPack({
                txServiceUrl: "https://safe-transaction-polygon.safe.global",
            });

            await web3AuthModalPack.init({
                options,
                adapters: [openloginAdapter],
                modalConfig,
            });

            if (web3AuthModalPack) {
                const { safes, eoa }: any = await web3AuthModalPack.signIn();
                const provider = web3AuthModalPack.getProvider() as ethers.providers.ExternalProvider;
                // alert(eoa)
                console.log(safes, new ethers.providers.Web3Provider(provider));

                const signer = new ethers.providers.Web3Provider(provider).getSigner();
                const relayPack = new GelatoRelayPack();
                const safeAccountAbstraction = new AccountAbstraction(signer);
                await safeAccountAbstraction.init({ relayPack });
                console.log("txs: ", txs);

                // we use a dump safe transfer as a demo transaction
                const dumpSafeTransafer: MetaTransactionData[] = [
                    {
                        to: "0xb50685c25485CA8C520F5286Bbbf1d3F216D6989",
                        // data: txs[0].data,
                        data: "0x",
                        value: ethers.utils.parseUnits("0.01", "ether").toString(),
                        // value: txs[0].value,
                        operation: 0, // OperationType.Call,
                    },
                ];

                // const dumpSafeTransafer: MetaTransactionData[] = txs
                console.log("dumpSafeTransafer: ", dumpSafeTransafer);

                //   const options: MetaTransactionOptions = {
                const options: any = {
                    isSponsored: false,
                    gasLimit: BigNumber.from("600000").toString(), // in this alfa version we need to manually set the gas limit
                    gasToken: ethers.constants.AddressZero, // native token
                };

                const gelatoTaskId = await safeAccountAbstraction.relayTransaction(dumpSafeTransafer, options);
                console.log("gelatoTaskId", gelatoTaskId);

                // we set react state with the provided values: owner (eoa address), chain, safes owned & web3 provider
                //   setChainId(chain.id)
                //   setOwnerAddress(eoa)
                //   setSafes(safes || [])
                //   setWeb3Provider(new ethers.providers.Web3Provider(provider))
                //   setWeb3AuthModalPack(web3AuthModalPack)
            }

            // // const txResponseOfBiconomyAA = await smartAccount?.sendTransactionBatch({transactions: txs,})
            // // const txReciept = await txResponseOfBiconomyAA?.wait()
            // // console.log("userOp hash", txResponseOfBiconomyAA?.hash)
            // // console.log("Tx hash", txReciept?.transactionHash)

            // const userOp = await smartAccount.buildUserOp(txs)
            // userOp.paymasterAndData = "0x"
            // console.log("userOp: ", userOp);

            // const userOpResponse = await smartAccount.sendUserOp(userOp)
            // console.log("userOp hash: ", userOpResponse);

            // const txReciept = await userOpResponse.wait()
            // console.log("Tx hash: ", txReciept?.receipt.transactionHash)

            // setTxHash(txReciept?.receipt.transactionHash)
            setSendtxLoading(false);
        } catch (error: any) {
            setSendtxLoading(false);
            console.log("sendToBiconomy-error: ", error);
            if (error.message) {
                toast.error(error.message);
            } else {
                toast.error(error);
            }
            return;
        }
    }
    return useMutation(sendToSafe);
}
