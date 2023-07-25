import axios from 'axios';
import web3 from 'web3';
import { BigNumber, ethers, utils } from 'ethers';
import { getImplementationAddress } from '@openzeppelin/upgrades-core';
import ERC20_ABI from '../abis/erc20_2.json';
import {
    ETHERSCAN_API_KEY,
    POLYGON_ETHERSCAN_API_KEY
} from './keys';
import { toast } from 'react-toastify';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

export const getProvider = async () => {
    try {
        let provider = await new ethers.providers.Web3Provider(
            web3.givenProvider
        );
        return provider;
    } catch (error) {
        console.log('Erc20Contract-Error: ', error);
    }
};

export const getSigner = async () => {
    try {
        let provider = await getProvider();
        if (!provider) return;
        const signer = await provider.getSigner();
        return signer;
    } catch (error) {
        console.log('Erc20Contract-Error: ', error);
    }
};

export const getDeadline = async (extra: any) => {
    try {
        const deadline = BigNumber.from(Math.floor(Date.now() / 1000)).add(
            extra
        );
        return deadline.toString();
    } catch (error) {
        console.log('deadline-Error: ', error);
    }
};

export const getDeadlineAfterMinus = async (extra: any) => {
    try {
        const deadline = BigNumber.from(Math.floor(Date.now() / 1000)).sub(
            extra
        );
        return deadline.toString();
    } catch (error) {
        console.log('deadline-Error: ', error);
    }
};

export const getAbiUsingExplorereUrl = async (
    network: string,
    toAddress: string
) => {
    try {
        let URL;
        if (network === 'mainnet') {
            URL = `https://api.etherscan.io/api?module=contract&action=getabi&address=${toAddress}&apikey=${ETHERSCAN_API_KEY}`;
        } else if (network === 'polygon') {
            URL = `https://api.polygonscan.com/api?module=contract&action=getabi&address=${toAddress}&apikey=${POLYGON_ETHERSCAN_API_KEY}`;
        }
        if (!URL) return;
        const resABI = await axios.get(URL);
        return JSON.parse(resABI.data.result);
    } catch (error) {
        console.log('GetABI-Error: ', error);
    }
};

export const getTransactionByBlockNumberAndIndexUsingExplorereUrl = async (
    network: string,
    txBlockNumber: string,
    txIndex: string
) => {
    try {
        let URL;
        if (network === 'mainnet') {
            URL = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByBlockNumberAndIndex&tag=${txBlockNumber}&index=${txIndex}&apikey=${ETHERSCAN_API_KEY}`;
        } else if (network === 'polygon') {
            URL = `https://api.polygonscan.com/api?module=proxy&action=eth_getTransactionByBlockNumberAndIndex&tag=${txBlockNumber}&index=${txIndex}&apikey=${POLYGON_ETHERSCAN_API_KEY}`;
        }
        if (!URL) return;
        const resDATA = await axios.get(URL);
        return resDATA.data.result;
    } catch (error) {
        console.log('TxBlockAndIndex-Error: ', error);
    }
};

export const getErc20Contract = async (tokenAddress: string) => {
    try {
        const tokenContract = await makeContract(tokenAddress, ERC20_ABI);
        return tokenContract;
    } catch (error) {
        console.log('Erc20Contract-Error: ', error);
    }
};

export const makeContract = async (contractAddress: string, abi: any) => {
    try {
        let signer = await getSigner();
        if (!signer) return;
        const contract = await new ethers.Contract(
            contractAddress,
            abi,
            signer
        );
        return contract;

        // const sdk = await new ThirdwebSDK("polygon");
    } catch (error) {
        console.log('Erc20Contract-Error: ', error);
    }
};

export const checkIfContractIsProxy = async (abi: any, contratAddress: any) => {
    try {
        let provider = await getProvider();
        if (!provider) return;
        let currentImplAddress;
        let isProxy: boolean = false;

        if (
            abi.filter(function (e: any) {
                return e.name === 'upgradeTo';
            }).length > 0
        ) {
            currentImplAddress = await getImplementationAddress(
                provider,
                contratAddress
            );
            isProxy = true;
        } else {
            currentImplAddress = contratAddress;
            isProxy = false;
        }
        return {
            isProxy: isProxy,
            currentImplAddress: currentImplAddress
        };
    } catch (error) {
        console.log('IfContractProxy-Error: ', error);
    }
};

// For other trade not for uni trade
export const checkBalanceAndAllowance = async (receipt: any) => {
    let id: any;
    try {
        const sig = 'Transfer(address,address,uint256)';

        const bytess = utils.toUtf8Bytes(sig);
        console.log('bytess', bytess);

        const bytessAfterKeccak = utils.keccak256(bytess);
        console.log('bytessAfterKeccak', bytessAfterKeccak);

        for (let i = 0; i < receipt.logs.length; i++) {
            if (receipt.logs[i].topics[0] === bytessAfterKeccak) {
                console.log('\n');

                const contractAddress = receipt.logs[i].address.toString();

                console.log('EventHash: ', i, receipt.logs[i].topics[0]);

                console.log('TokenAddress', receipt.logs[i].address.toString());

                const from = utils.defaultAbiCoder.decode(
                    ['address'],
                    receipt.logs[i].topics[1]
                );
                console.log('from', from.toString());
                console.log('receipt.from', receipt.from.toString());

                if (
                    from.toString().toLowerCase() ===
                    receipt.from.toString().toLowerCase()
                ) {
                    console.log('from', from.toString());

                    const to = utils.defaultAbiCoder.decode(
                        ['address'],
                        receipt.logs[i].topics[2]
                    );
                    console.log('to', to.toString());

                    const value = utils.defaultAbiCoder.decode(
                        ['uint256'],
                        receipt.logs[i].data
                    );
                    console.log('value', value.toString());

                    const contractWrite = await getErc20Contract(
                        contractAddress
                    );
                    const sdk = await new ThirdwebSDK('polygon');
                    const contract = await sdk.getContract(
                        contractAddress,
                        ERC20_ABI
                    );
                    if (!contractWrite) return;
                    if (!contract) return;

                    const allowance = await contract.call('allowance', [
                        receipt.from,
                        receipt.to
                    ]);
                    // const allowance = await contract.callStatic.allowance(receipt.from, receipt.to)
                    console.log('allowance', allowance.toString());

                    const tokenBalance = await contract.call('balanceOf', [
                        receipt.from
                    ]);
                    // const tokenBalance = await contract.callStatic.balanceOf(receipt.from)
                    console.log('tokenBalance', tokenBalance.toString());

                    if (BigNumber.from(allowance).lt(value.toString())) {
                        console.log('need allownace');
                        const signer = await getSigner();
                        if (!signer) return;

                        // approve with toast pending
                        id = toast.loading('Approve Pending...');
                        const tx = await contractWrite
                            .connect(signer)
                            .approve(
                                receipt.to,
                                BigNumber.from(value.toString())
                            );
                        await tx.wait();
                        toast.update(id, {
                            render: 'Approved',
                            type: 'success',
                            isLoading: false,
                            autoClose: 5000
                        });
                    }

                    if (BigNumber.from(tokenBalance).lt(value.toString())) {
                        console.log('not enough Balance');
                        toast.error(`Not enough Balance for this tx`);
                        return;
                    }
                }
            }
        }
        console.log('\n');
    } catch (error) {
        toast.update(id, {
            render: 'Approve Error',
            type: 'error',
            isLoading: false,
            autoClose: 5000
        });
        console.log('chackBalanceAndAllwance-error-', error);
    }
};
