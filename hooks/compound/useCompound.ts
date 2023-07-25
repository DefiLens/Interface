import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { compoundContractAddress } from "../../utils/constants";

type CompoundDeposit = {
  token: string;
  value: string;
  address?: string;
};

type CompoundWithdraw = {
  token: string;
  value: string;
  address?: string;
};

const compoundDepositTx = async ({ token, value }: CompoundDeposit) => {
  const compoundInterface = new ethers.utils.Interface([
    "function supply(address asset, uint256 amount)",
  ]);
  const encodedData = compoundInterface.encodeFunctionData("supply", [
    token,
    value,
  ]);
  const tx = {
    to: compoundContractAddress,
    data: encodedData,
  };
  return tx;
};

const compoundWithdrawTx = async ({ token, value }: CompoundWithdraw) => {
  const compoundInterface = new ethers.utils.Interface([
    "function withdraw(address asset,uint256 amount)",
  ]);
  const encodedData = compoundInterface.encodeFunctionData("withdraw", [
    token,
    value,
  ]);
  const tx = {
    to: compoundContractAddress,
    data: encodedData,
  };
  return tx;
};

export function useCompoundDepositTx() {
  return useMutation(compoundDepositTx);
}

export function useCompoundWithdrawTx() {
  return useMutation(compoundWithdrawTx);
}
