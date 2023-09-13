import { toast } from 'react-hot-toast';

import { useMutation } from '@tanstack/react-query';

import { _nonce, _functionType } from '../../utils/constants';
import { useGlobalStore, iGlobal } from '../../store/GlobalStore';
import { useCrossChainDifiStore, iCrossChainDifi } from '../../store/CrossChainDifiStore';

export function useBiconomyProvider() {
    
const {
    smartAccount,
  }: iGlobal = useGlobalStore((state) => state);

const {
      setSendtxLoading,
      setTxHash,
  }: iCrossChainDifi = useCrossChainDifiStore((state) => state);

    async function sendToBiconomy(txs) {
        try {
            // const txResponseOfBiconomyAA = await smartAccount?.sendTransactionBatch({transactions: txs,})
            // const txReciept = await txResponseOfBiconomyAA?.wait()
            // console.log("userOp hash", txResponseOfBiconomyAA?.hash)
            // console.log("Tx hash", txReciept?.transactionHash)

            const userOp = await smartAccount.buildUserOp(txs)
            userOp.paymasterAndData = "0x"
            console.log("userOp: ", userOp);

            const userOpResponse = await smartAccount.sendUserOp(userOp)
            console.log("userOp hash: ", userOpResponse);

            const txReciept = await userOpResponse.wait()
            console.log("Tx hash: ", txReciept?.receipt.transactionHash)

            setTxHash(txReciept?.receipt.transactionHash)
            setSendtxLoading(false)
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
    return useMutation(sendToBiconomy);
}
