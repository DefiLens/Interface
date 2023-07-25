import { useEffect, useState } from "react";
import { css } from "@emotion/css";
import { useAppStore } from "../store/appStore";
import { useCallBatch } from "../hooks/callBatch/useCallBatch";
import { useGetTotalSupply } from "../hooks/useErc20Hooks";
import axios from "axios";
import { USDC, USDT, aTokensArray } from "../utils/constants";
import { BigNumber } from "ethers";

type otherParams = {
  tokenIn?: any;
  tokenOut?: any;
  amountIn?: any;
  address?: any;
};

type props = {
  params: otherParams;
  action: any;
};

export default function CFormDetails({ balance, cToken, index }) {
  const { smartAccount }: any = useAppStore((state) => state);
  const [nativeBalances, setNativeBal] = useState<any[]>([]);
  const [aTokenBal, setATokenBal] = useState<any[]>([]);
  const [txs, setTxs] = useState<any[]>([]);
  const [receipeName, setRecipe] = useState();
  const [tokenIn, setTokenIn] = useState();
  const [tokenOut, setTokenOut] = useState();
  const [amountIn, setAmountIn] = useState();

  const handleTokenIn = async (_tokenIn) => {
    setTokenIn(_tokenIn);
  };

  const handleTokeOut = async (_tokenOut) => {
    setTokenOut(_tokenOut);
  };

  const handleAmountIn = async (_amountIn) => {
    setAmountIn(_amountIn);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      const data = await getBalances();
      console.log("data: ", data);
      setNativeBal(data.nativeBalances);
      setATokenBal(data.shareBalances);
    };
    if (smartAccount) {
      fetchBalance();
    }
  }, [smartAccount]);

  const getBalances = async () => {
    try {
      console.log("getBalances");
      const response = await axios.get(
        "http://localhost:3000/erc20/getBalancesAave",
        {
          params: {
            address: smartAccount.address,
          },
        }
      );
      //   console.log("getBalances-Resp: ", response);
      return response.data;
    } catch (error) {
      console.log("getBalances---error", error);
    }
  };

  const getSuggestions = async () => {
    try {
      console.log("getSuggestions");
      const response = await axios.get(
        "http://localhost:3000/recipe1/recipeSuggestions",
        {
          params: {
            tokenIn: "0x1a13F4Ca1d028320A707D99520AbFefca3998b7F",
          },
        }
      );
      console.log("getSuggestions-Resp: ", response);
    } catch (error) {
      console.log("getSuggestions---error", error);
    }
  };

  // aave withdraw - swap - compound deposit
  const callBatch = async () => {
    try {
      if (!receipeName) return;
      if (tokenIn == tokenOut) {
        alert("tokenIn and tokenOut can't be same");
        return;
      }
      setTxs([]);
      // const totalSupply = await getTotalSupply()
      console.log("callBatch---Hello");
      const response = await axios.post(
        `http://localhost:3000/recipe2/${receipeName}`,
        {
          tokenIn: tokenIn,
          tokenOut: tokenOut,
          amountIn: amountIn,
          address: smartAccount.address,
          type: "exactIn",
        }
      ); // replace with the contract address
      console.log("response---", response);

      if (response.data.tempTxs.length > 0) {
        if (txs.length > 0) {
          setTxs(txs?.concat(response.data.tempTxs));
        } else {
          setTxs(response.data.tempTxs);
        }
      }
    } catch (error) {
      console.log("totalSupply---error", error);
    }
  };

  const sendTx = async () => {
    try {
      console.log("smartAccount", smartAccount);
      console.log("txs", txs);
      const txResponse = await smartAccount?.sendTransactionBatch({
        transactions: txs,
      });
      // const txResponse = await smartAccount?.sendTransaction({ transaction: tx });
      console.log("userOp hash", txResponse?.hash);
      // If you do not subscribe to listener, one can also get the receipt like shown below
      const txReciept = await txResponse?.wait();
      console.log("Tx hash", txReciept?.transactionHash);
    } catch (error) {
      console.log("sendTx-error", error);
      alert("this trade is not possible");
    }
  };

  const handleChangeSelect = async (_selected, index) => {
    if (!_selected) return;
    setRecipe(_selected);
  };

  return (
    <>
      <div
        style={{
          width: "600px",
          border: "1px solid #000",
          margin: "10px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffff00",
            border: "5px solid #000",
            margin: "25px",
            padding: "25px",
            color: "black",
          }}
        >
          <h2>
            {cToken}: {balance} {" Balance"}
          </h2>
          <select
            name="recipe2"
            id="recipe2"
            onChange={(e) => handleChangeSelect(e.target.value, index)}
          >
            <option value="">-</option>
            <option value="recipe2.1">
              recipe1 (compound withdraw - swap - aave deposit)
            </option>
            {/* <option value="recipe2.2">recipe2 (compound withdraw - swap - compound deposit)</option> */}
            <option value="recipe2.3">
              recipe3 (compound withdraw - swap)
            </option>
          </select>
          {receipeName && (
            <>
              <div>
                {/* <input
              style={{
                marginTop: "10px",
                width: "100%",
                height: "50%",
                padding: "10px",
              }}
              placeholder="tokenIn"
              onChange={(e: any) => handleTokenIn(e.target.value)}
            /> */}
                <select
                  name="recipe"
                  id="recipe"
                  onChange={(e) => handleTokenIn(e.target.value)}
                >
                  <option value="">-</option>
                  <option value="0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174">
                    USDC
                  </option>
                </select>
              </div>
              <div>
                <select
                  name="recipe"
                  id="recipe"
                  onChange={(e) => handleTokeOut(e.target.value)}
                >
                  <option value="">-</option>
                  <option value="0xc2132D05D31c914a87C6611C10748AEb04B58e8F">
                    USDT
                  </option>
                  <option value="0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063">
                    DAI
                  </option>
                  <option value="0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619">
                    WETH
                  </option>
                  <option value="0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270">
                    WMATIC
                  </option>
                  <option value="0xD6DF932A45C0f255f85145f286eA0b292B21C90B">
                    AAVE
                  </option>
                </select>
              </div>

              <div>
                <input
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    height: "50%",
                    padding: "10px",
                  }}
                  placeholder="amountIn"
                  onChange={(e: any) => handleAmountIn(e.target.value)}
                />
              </div>
            </>
          )}
          <div>
            <button className={buttonStyle} onClick={callBatch}>
              Call batch
            </button>
          </div>
          <div>
            <button className={buttonStyle} onClick={sendTx}>
              Send batch
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const detailsContainerStyle = css`
  margin-top: 0px;
`;

const buttonStyle = css`
  padding: 14px;
  width: 300px;
  border: none;
  cursor: pointer;
  border-radius: 999px;
  outline: none;
  margin-top: 20px;
  transition: all 0.25s;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const headerStyle = css`
  font-size: 44px;
`;

const containerStyle = css`
  width: 900px;
  margin: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 20px;
`;

const outer = css`
  width: 400px;
  border: 1px solid #000;
`;

const inner = css`
  background-color: #ffff00;
  border: 5px solid #000;
  margin: 25px;
  padding: 25px;
`;
