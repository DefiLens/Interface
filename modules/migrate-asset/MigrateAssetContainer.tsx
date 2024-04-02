import { useEffect, useState } from "react";

import { useAddress } from "@thirdweb-dev/react";

import MigrateAsset from "./MigrateAsset";
import { usePortfolio } from "../../hooks/portfolio/usePortfolio";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";
import { BigNumber, ethers } from "ethers";
import web3 from "web3";
import IERC20 from "../../abis/IERC20.json";
import toast from "react-hot-toast";
import { useBiconomyProvider } from "../../hooks/aaProvider/useBiconomyProvider";

const MigrateAssetContainer: React.FC<any> = () => {
    const { mutateAsync: sendToBiconomy } = useBiconomyProvider();
    const { mutateAsync: fetchPortfolio } = usePortfolio();
    const address = useAddress();

    const [scwTokenAddressesData, setScwTokenAddressesData] = useState<any>([]);
    const [eoaTokenAddressesData, setEoaTokenAddressesData] = useState<any>([]);
    const [isAllErc20Selected, setIsAllErc20Selected] = useState<any>(false);
    const [isAllDefiSelected, setIsAllDefiSelected] = useState<any>(false);

    const {
        smartAccountAddress,
        selectedNetwork
    }: iGlobal = useGlobalStore((state) => state);

    const { userTokensData, setUserTokensData, isUsersTokenLoading, isSCW }: iPortfolio = usePortfolioStore(
        (state) => state
    );

    const handleFetchPorfolioData = () => {
        const fetch = async (address: string, chainId: string) => {
            setIsAllErc20Selected(false)
            setIsAllDefiSelected(false)
            await fetchPortfolio({ address, chainId });
        };

        if (isSCW && smartAccountAddress) {
            setUserTokensData(null);
            // Fetch SCW Portfolio Data
            fetch(smartAccountAddress, selectedNetwork.chainId);
        }
        if (!isSCW && address) {
            setUserTokensData(null);
            // Fetch EOA Portfolio Data
            fetch(address, selectedNetwork.chainId);
        }
    };

    useEffect(() => {
        if (selectedNetwork.chainId) {
            handleFetchPorfolioData();
            isTokenAddresses();
        }
    }, [selectedNetwork, isSCW]);

    const isTokenAddresses = async () => {
        if (isSCW) {
            if (localStorage.getItem("scwTokenAddressesData")?.toString() !== undefined) {
                const tokenAddresses = JSON.parse(localStorage.getItem("scwTokenAddressesData")?.toString() ?? "");
                setScwTokenAddressesData(tokenAddresses);
            }
        } else {
            if (localStorage.getItem("eoaTokenAddressesData")?.toString() !== undefined) {
                const tokenAddresses = JSON.parse(localStorage.getItem("eoaTokenAddressesData")?.toString() ?? "");
                setEoaTokenAddressesData(tokenAddresses);
            }
        }
    };

    useEffect(() => {
        // Load checked tokens from local storage if any, otherwise set [] on component mount
        const storedTokens1 = JSON.parse(localStorage.getItem("scwTokenAddressesData") || "[]");
        const storedTokens2 = JSON.parse(localStorage.getItem("eoaTokenAddressesData") || "[]");
        setScwTokenAddressesData(storedTokens1);
        setEoaTokenAddressesData(storedTokens2);
    }, []);

    const checkTokensData = (tokenAddress: any) => {
        if (isSCW) {
            setIsAllErc20Selected(false);
            setIsAllDefiSelected(false);
            let updatedCheckedTokens: any = [...scwTokenAddressesData];

            if (updatedCheckedTokens.includes(tokenAddress)) {
                updatedCheckedTokens = updatedCheckedTokens.filter((t) => t !== tokenAddress);
            } else {
                updatedCheckedTokens.push(tokenAddress);
            }

            setScwTokenAddressesData(updatedCheckedTokens);
            localStorage.setItem("scwTokenAddressesData", JSON.stringify(updatedCheckedTokens));
        } else {
            setIsAllErc20Selected(false);
            setIsAllDefiSelected(false);
            let updatedCheckedTokens: any = [...eoaTokenAddressesData];

            if (updatedCheckedTokens.includes(tokenAddress)) {
                updatedCheckedTokens = updatedCheckedTokens.filter((t) => t !== tokenAddress);
            } else {
                updatedCheckedTokens.push(tokenAddress);
            }

            setEoaTokenAddressesData(updatedCheckedTokens);
            localStorage.setItem("eoaTokenAddressesData", JSON.stringify(updatedCheckedTokens));
        }
    };

    const selectAllTokens = (tokenType: string, userTokensData: any) => {
        if (tokenType === 'erc20Token' && !isAllErc20Selected) {
            const allTokenAddresses = userTokensData.map(token => token.tokenAddress);
            if (isSCW) {
                setScwTokenAddressesData(allTokenAddresses);
                localStorage.setItem("scwTokenAddressesData", JSON.stringify(allTokenAddresses));
                setIsAllErc20Selected(true);
            } else {
                setEoaTokenAddressesData(allTokenAddresses);
                localStorage.setItem("eoaTokenAddressesData", JSON.stringify(allTokenAddresses));
                setIsAllErc20Selected(true);
            }
        }
        if (tokenType === 'erc20Token' && isAllErc20Selected) {
            if (isSCW) {
                setScwTokenAddressesData([]);
                localStorage.setItem("scwTokenAddressesData", JSON.stringify([]));
                setIsAllErc20Selected(false);

            } else {
                setEoaTokenAddressesData([]);
                localStorage.setItem("eoaTokenAddressesData", JSON.stringify([]));
                setIsAllErc20Selected(false);
            }
        }

        if (tokenType === 'defiToken' && !isAllDefiSelected) {
            const allTokenAddresses = userTokensData.map(token => token.tokenAddress);
            if (isSCW) {
                setScwTokenAddressesData(allTokenAddresses);
                localStorage.setItem("scwTokenAddressesData", JSON.stringify(allTokenAddresses));
                setIsAllDefiSelected(true)
            } else {
                setEoaTokenAddressesData(allTokenAddresses);
                localStorage.setItem("eoaTokenAddressesData", JSON.stringify(allTokenAddresses));
                setIsAllDefiSelected(true)
            }
        }
        if (tokenType === 'defiToken' && isAllDefiSelected) {
            if (isSCW) {
                setScwTokenAddressesData([]);
                localStorage.setItem("scwTokenAddressesData", JSON.stringify([]));
                setIsAllDefiSelected(false)

            } else {
                setEoaTokenAddressesData([]);
                localStorage.setItem("eoaTokenAddressesData", JSON.stringify([]));
                setIsAllDefiSelected(false)
            }
        }

    };

    const sendAllTokens = async (isSCW, _tokenAddresses) => {
        try {
            const from = isSCW ? smartAccountAddress : address;
            const to = isSCW ? address : smartAccountAddress;
            let provider = await new ethers.providers.Web3Provider(web3.givenProvider);
            if (!provider) return;
            const signer = await provider.getSigner();
            if (!signer) return;
            const txArray: any = [];
            for (let i = 0; i < _tokenAddresses.length; i++) {
                if (isSCW) {
                    const contract = await new ethers.Contract(_tokenAddresses[i], IERC20, signer);
                    if (!signer) {
                        toast.error("Please connect wallet or refresh it!");
                        return;
                    }
                    const balance = await contract.balanceOf(from);

                    if (BigNumber.from(balance).gte(0)) {
                        const data = await contract.populateTransaction.transfer(to, balance);
                        const tx = { to: _tokenAddresses[i], data: data.data };
                        txArray.push(tx);
                    }
                } else {
                    const contract = await new ethers.Contract(_tokenAddresses[i], IERC20, signer);
                    if (!signer) {
                        toast.error("Please connect wallet or refresh it!");
                        return;
                    }
                    const balance = await contract.balanceOf(from);

                    if (BigNumber.from(balance).gte(0)) {
                        const data = await contract.populateTransaction.transfer(to, balance);
                        const tx = { to: _tokenAddresses[i], data: data.data };
                        const txReciept = await signer.sendTransaction(tx);
                        await txReciept?.wait();
                    }
                }
            }
            if (isSCW) {
                console.log("txArray:", txArray);
                const tempTxhash = await sendToBiconomy(txArray);
                toast.success(`Tx Succefully done: ${tempTxhash}`);
            }
            toast.success(`All Tx Succefully done:`);
        } catch (error) {
            console.log("getContract-error", error);
        }
    };

    const handleExecuteMgrateAsset = () => {
        if (isSCW) {
            sendAllTokens(true, scwTokenAddressesData);
            console.log("Execute: Scw Tokens", scwTokenAddressesData);
        } else {
            sendAllTokens(false, eoaTokenAddressesData);
            console.log("Execute: Eoa Tokens", eoaTokenAddressesData);
        }
    };

    const separatedArray = (userTokensData || [])
        .filter((token: any) => token.type === "defiToken")
        .reduce((acc, curr) => {
            const key: any = curr.protocol?.name;
            if (!acc[key]) {
                acc[key] = [curr];
            } else {
                acc[key].push(curr);
            }
            return acc;
        }, {});

    const filteredDefiTokens = Object.values(separatedArray);

    const TotalNetWorth = (userTokensData || []).reduce(
        (acc, curr) => {
            acc.netWorth = parseFloat(curr.amount);
            return acc;
        },
        { netWorth: 0 }
    );

    return (
        <MigrateAsset
            isUsersTokenLoading={isUsersTokenLoading}
            smartAccountAddress={smartAccountAddress}
            userTokensData={userTokensData}
            filteredDefiTokens={filteredDefiTokens}
            handleFetchPorfolioData={handleFetchPorfolioData}
            totalNetWorth={TotalNetWorth.netWorth}
            scwTokenAddressesData={scwTokenAddressesData}
            eoaTokenAddressesData={eoaTokenAddressesData}
            checkTokensData={checkTokensData}
            handleExecuteMgrateAsset={handleExecuteMgrateAsset}
            selectAllTokens={selectAllTokens}
            isAllErc20Selected={isAllErc20Selected}
            isAllDefiSelected={isAllDefiSelected}
        />
    );
};
export default MigrateAssetContainer;
