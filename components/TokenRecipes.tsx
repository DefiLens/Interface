import { useEffect, useState } from "react";
import { css } from "@emotion/css";
import { useAppStore } from "../store/appStore";
import { useCallBatch } from "../hooks/callBatch/useCallBatch";
import { useGetTotalSupply } from "../hooks/useErc20Hooks";
import axios from "axios";
import {
  USDC,
  USDT,
  aTokensArray,
  aTokensArrayDecimal,
  cTokensArray,
  cTokensArrayDecimal,
} from "../utils/constants";
import { BigNumber as bg } from "bignumber.js";
import { BigNumber } from "ethers";
import FormDetails from "./FormDetails";
import CFormDetails from "./CFormDetails";

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

export default function TokenRecipes() {
  const { smartAccount }: any = useAppStore((state) => state);
  const [nativeBalances, setNativeBal] = useState<any[]>([]);
  const [aTokenBal, setATokenBal] = useState<any[]>([]);
  const [cTokenBal, setCTokenBal] = useState<any[]>([]);
  const [txs, setTxs] = useState<any[]>([]);
  const [receipeName, setRecipe] = useState();
  const [tokenIn, setTokenIn] = useState();
  const [tokenOut, setTokenOut] = useState();
  const [amountIn, setAmountIn] = useState();
  const [displayTokens, setDisplayTokens] = useState("aToken");

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
      await getBalances();
      //   console.log("data: ", data);
      //   console.log(
      //     "aTokenBal1",
      //     BigNumber.from(data.shareBalances[0]).toString()
      //   );
      //   //   console.log('aTokenBal2', (BigNumber(10).pow(6)).toString())
      //   const dat = BigNumber.from(data.shareBalances[0]).toString();
      //   console.log(
      //     "aTokenBal--",
      //     bg(BigNumber.from(data.shareBalances[0]).toString())
      //       .div(10 ** aTokensArrayDecimal[0])
      //       .toString()
      //   );
    };
    if (smartAccount) {
      fetchBalance();
    }
  }, [smartAccount]);

  const getBalances = async () => {
    try {
      console.log("getBalances");
      const response1 = await axios.get(
        "http://localhost:3000/erc20/getBalancesAave",
        {
          params: {
            address: smartAccount.address,
          },
        }
      );
      console.log("getBalances-response1: ", response1);
      setNativeBal(response1.data.nativeBalances);
      setATokenBal(response1.data.shareBalances);

      const response2 = await axios.get(
        "http://localhost:3000/erc20/getBalancesCompound",
        {
          params: {
            address: smartAccount.address,
          },
        }
      );
      console.log("getBalances-response2: ", response2);
      setCTokenBal(response2.data.shareBalances);

      return response1.data;
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
      alert("receipeName: " + receipeName);
      setTxs([]);
      // const totalSupply = await getTotalSupply()
      console.log("callBatch---Hello");
      let response;
      if (receipeName == "recipe1.4" && receipeName == "recipe1.5") {
        response = await axios.post(
          `http://localhost:3000/recipe1/${receipeName}`,
          {
            tokenIn: tokenIn,
            amountIn: amountIn,
            address: smartAccount.address,
          }
        ); // replace with the contract address
      } else {
        response = await axios.post(
          `http://localhost:3000/recipe1/${receipeName}`,
          {
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            amountIn: amountIn,
            address: smartAccount.address,
            type: "exactIn",
          }
        ); // replace with the contract address
      }
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
  };

  const handleDisplayTokens = async (_selected) => {
    if (!_selected) return;
    setDisplayTokens(_selected);
  };

  return (
    <div className={containerStyle}>
      {!!smartAccount && (
        <div>
          <div>
            <h1>
              <label>Chosse Tokens by positions: </label>
              <select
                name="shareTokens"
                id="shareTokens"
                onChange={(e) => handleDisplayTokens(e.target.value)}
              >
                <option value="aToken">aTokens</option>
                <option value="cToken">cTokens</option>
              </select>
            </h1>
            {displayTokens && displayTokens == "aToken" ? (
              <>
                {aTokenBal &&
                  aTokenBal.map((balance, index) => (
                    <div key={index}>
                      {BigNumber.from(balance).gt(0) && (
                        <>
                          <FormDetails
                            balance={bg(BigNumber.from(balance).toString())
                              .div(10 ** aTokensArrayDecimal[index])
                              .toString()}
                            aToken={aTokensArray[index]}
                            index={index}
                          />
                        </>
                      )}
                    </div>
                  ))}
              </>
            ) : (
              <>
                {cTokenBal &&
                  cTokenBal.map((balance, index) => (
                    <div key={index}>
                      {BigNumber.from(balance).gt(0) && (
                        <>
                          <CFormDetails
                            balance={bg(BigNumber.from(balance).toString())
                              .div(10 ** cTokensArrayDecimal[index])
                              .toString()}
                            cToken={cTokensArray[index]}
                            index={index}
                          />
                        </>
                      )}
                    </div>
                  ))}
              </>
            )}
          </div>
          {/* <div>
            <button className={buttonStyle} onClick={callBatch}>
              Call batch
            </button>
          </div>
          <div>
            <button className={buttonStyle} onClick={sendTx}>
              Send batch
            </button>
          </div>
          <div>
            <button className={buttonStyle} onClick={getBalances}>
              GetBalances
            </button>
          </div>
          <div>
            <button className={buttonStyle} onClick={getSuggestions}>
              GetSuggetions
            </button>
          </div> */}
        </div>
      )}
    </div>
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
