import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { aaveContractAddress } from "../../utils/constants";

type AaveDeposit = {
  token: string;
  value: string;
  address?: string;
};

type AaveWithdraw = {
  token: string;
  value: string;
  address: string;
};

const aaveDepositTx = async ({ token, value, address }: AaveDeposit) => {
  const aaveInterface = new ethers.utils.Interface([
    "function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
  ]);
  const encodedData = aaveInterface.encodeFunctionData("deposit", [
    token,
    value,
    address,
    0,
  ]);
  const tx = {
    to: aaveContractAddress,
    data: encodedData,
  };
  return tx;
};

const aaveWithdrawTx = async ({ token, value, address }: AaveWithdraw) => {
  const aaveInterface = new ethers.utils.Interface([
    "function withdraw(address asset, uint256 amount, address to)",
  ]);
  const encodedData = aaveInterface.encodeFunctionData("withdraw", [
    token,
    value,
    address,
  ]);
  const tx = {
    to: aaveContractAddress,
    data: encodedData,
  };
  return tx;
};

export function useAaveDepositTx() {
  return useMutation(aaveDepositTx);
}

export function useAaveWithdrawTx() {
  return useMutation(aaveWithdrawTx);
}
