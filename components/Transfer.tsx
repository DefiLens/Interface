import {useEffect, useState} from "react"
import {css} from "@emotion/css"
import web3 from "web3"
import {BigNumber, ethers} from "ethers"
import {BigNumber as bg} from "bignumber.js"
import IStarGateRouter from "../abis/IStarGateRouter.json"
import IERC20 from "../abis/IERC20.json"
import ChainPing from "../abis/ChainPing.json"
import {useAppStore} from "../store/appStore"
import {
    checkIfContractIsProxy,
    getAbiUsingExplorereUrl,
    batch,
    calculateFees,
} from "../utils/helper"
import {MAINNET_INFURA} from "../utils/keys"
import {useAddress} from "@thirdweb-dev/react"

export default function Transfer() {
    const {smartAccount}: any = useAppStore((state) => state)
    const address = useAddress() // Detect the connected address
    const [tokenAddress, setTokenAddress] = useState<any>()
    const [amountIn, setAmountIn] = useState<any>(0)
    const [amountInDecimals, setAmountInDecimals] = useState<any>(0)
    const [isNative, setIsnative] = useState<any>("Native")

    const onOptionChange = (e) => {
        setIsnative(e.target.value)
    }
    const handleTokenAddress = async (_tokenAddress) => {
        try {
            setAmountIn(0)
            setTokenAddress(_tokenAddress)
            const contract = await getContract(_tokenAddress)
            if (!contract) {
                alert("Not valid Token address")
            }
        } catch (error) {
            console.log("handleTokenAddress-error", error)
        }
    }
    const handleAmountIn = async (_amountIn) => {
        setAmountInDecimals(_amountIn)
        if (isNative == "Native") {
            let amountInByDecimals = bg(_amountIn)
            amountInByDecimals = amountInByDecimals.multipliedBy(bg(10).pow(18))
            if (amountInByDecimals.eq(0)) {
                setAmountIn(_amountIn)
            } else {
                setAmountIn(amountInByDecimals.toString())
            }
            console.log(
                "amountInByDecimals-native",
                amountInByDecimals.toString()
            )
        } else {
            const contract = await getContract(tokenAddress)
            if (!contract) {
                alert("Not valid token address")
                return
            }
            let decimal = await contract.decimals()
            let amountInByDecimals = bg(_amountIn)
            amountInByDecimals = amountInByDecimals.multipliedBy(
                bg(10).pow(decimal.toNumber())
            )
            if (amountInByDecimals.eq(0)) {
                setAmountIn(_amountIn)
            } else {
                setAmountIn(amountInByDecimals.toString())
            }
            console.log(
                "amountInByDecimals-erc20",
                amountInByDecimals.toString()
            )
        }
    }
    const getContract = async (_tokenAddress) => {
        try {
            let provider = await new ethers.providers.Web3Provider(
                web3.givenProvider
            )
            if (!provider) return
            const signer = await provider.getSigner()
            if (!signer) return
            const contract = await new ethers.Contract(
                _tokenAddress,
                IERC20,
                signer
            )
            return contract
        } catch (error) {
            console.log("getContract-error", error)
        }
    }
    const send = async () => {
        try {
            let tx
            if (isNative == "Native") {
                let provider = await new ethers.providers.Web3Provider(
                    web3.givenProvider
                )
                if (!provider) return
                const balance = await provider.getBalance(smartAccount.address)
                if (!BigNumber.from(balance).gte(amountIn)) {
                    alert("Not native enough balance")
                    return
                }
                tx = {
                    to: address,
                    value: amountIn,
                }
                console.log("tx", tx)
            } else {
                const contract = await getContract(tokenAddress)
                if (!contract) {
                    alert("add valid Token address first")
                    return
                }
                const balance = await contract.balanceOf(smartAccount.address)
                if (!BigNumber.from(balance).gte(amountIn)) {
                    alert("Not erc20 enough balance")
                    return
                }
                console.log("erc20", address, amountIn.toString())
                const data = await contract.populateTransaction.transfer(
                    address,
                    amountIn
                )
                tx = {
                    to: tokenAddress,
                    data: data.data,
                }
                console.log("tx", tx)
            }
            const txResponseOfBiconomyAA =
                await smartAccount?.sendTransactionBatch({
                    transactions: [tx],
                })
            const txReciept = await txResponseOfBiconomyAA?.wait()
            console.log("userOp hash", txResponseOfBiconomyAA?.hash)
            console.log("Tx hash", txReciept?.transactionHash)
        } catch (error) {
            console.log("send-error: ", error)
        }
    }
    return (
        <>
            {!smartAccount && (
                <div className={box1}>
                    <h3>Login First!</h3>
                </div>
            )}
            {smartAccount && (
                <div className={center}>
                    <div className={box1}>
                        <div style={{marginTop: "2%"}}>
                            <input
                                type="radio"
                                name="topping"
                                value="Native"
                                id="regular"
                                checked={isNative === "Native"}
                                onChange={onOptionChange}
                            />
                            <label htmlFor="regular">
                                Native Token transfer
                            </label>

                            <input
                                type="radio"
                                name="topping"
                                value="ERC20"
                                id="medium"
                                checked={isNative === "ERC20"}
                                onChange={onOptionChange}
                            />
                            <label htmlFor="medium">ERC20 Token Transfer</label>
                        </div>
                        <div className={box1}>
                            <h3>From Address</h3>
                            <h6 style={{marginBottom: "2%"}}>{smartAccount.address}</h6>
                            <h3>To Address</h3>
                            <h6 style={{marginBottom: "2%"}}>{address}</h6>
                            {isNative != "Native" ? (
                                <>
                                    <h3>Token: </h3>
                                    <input
                                        style={{
                                            width: "50%",
                                            height: "50%",
                                            padding: "10px",
                                            marginLeft: "20%",
                                            marginRight: "20%",
                                            marginBottom: "2%",
                                        }}
                                        placeholder="Token"
                                        value={tokenAddress}
                                        onChange={(e: any) =>
                                            handleTokenAddress(e.target.value)
                                        }
                                    />
                                </>
                            ) : (
                                ""
                            )}
                            <h3>Amount: </h3>
                            <input
                                style={{
                                    width: "50%",
                                    height: "50%",
                                    padding: "10px",
                                    marginLeft: "20%",
                                    marginRight: "20%",
                                    marginBottom: "2%",
                                }}
                                placeholder="Amount"
                                value={amountInDecimals}
                                onChange={(e: any) =>
                                    handleAmountIn(e.target.value)
                                }
                            />
                            <button
                                style={{
                                    width: "50%",
                                    height: "50%",
                                    padding: "10px",
                                    marginLeft: "20%",
                                    marginRight: "20%",
                                    marginBottom: "2%",
                                    backgroundColor: "black",
                                    color: "white",
                                }}
                                onClick={(e: any) => send()}
                            >
                                Send SCW to EOA
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

const center = css`
    padding: 60px 0;
    border: 3px solid green;
    text-align: center;
    height: auto;
`

const box1 = css`
    margin-top: 20px;
    margin-left: 20%;
    margin-right: 20%;
    border: 1px solid black;
    padding: 15px;
    background: lightgray;
    background-clip: border-box;
`

const sendTxcss = css`
    width: 20%;
    padding: 10px;
    background: black;
    color: white;
    font-size: 15px;
`

const gridContainer = css`
    display: grid;
    grid-template-columns: auto auto auto;
    background-color: #2196f3;
    padding: 10px;
`
const gridItem = css`
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.8);
    padding: 20px;
    font-size: 30px;
    text-align: center;
`
