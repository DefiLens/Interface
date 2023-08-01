import {useState, useEffect, useRef} from "react"
import SocialLogin from "@biconomy/web3-auth"
import {ChainId} from "@biconomy/core-types"
import {ethers} from "ethers"
import SmartAccount from "@biconomy/smart-account"
import {css} from "@emotion/css"
import {Biconomy_AA_Key} from "../utils/keys"
import {useAppStore} from "../store/appStore"
import {
    ConnectWallet,
    metamaskWallet,
    useAddress,
    useConnect,
    useNetwork,
    useNetworkMismatch,
    useSwitchChain,
} from "@thirdweb-dev/react"

export default function Home() {
    const {setSmartAccount, smartAccount}: any = useAppStore((state) => state)
    const [interval, enableInterval] = useState(false)
    const sdkRef = useRef<SocialLogin | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const isOnWrongNetwork = useNetworkMismatch() // Detect if the user is on the wrong network
    const [, switchNetwork] = useNetwork()
    const metamaskConfig = metamaskWallet()
    const connect = useConnect()
    const address = useAddress() // Detect the connected address

    useEffect(() => {
        let configureLogin
        if (interval) {
            configureLogin = setInterval(() => {
                if (!!sdkRef.current?.provider) {
                    setupSmartAccount()
                    clearInterval(configureLogin)
                }
            }, 1000)
        }
    }, [interval])

    async function login() {
        if (!sdkRef.current) {
            const socialLoginSDK = new SocialLogin()
            // const signature1 = await socialLoginSDK.whitelistUrl(
            //   "http://localhost:3000/"
            // );
            await socialLoginSDK.init({
                chainId: ethers.utils.hexValue(ChainId.POLYGON_MAINNET),
                // whitelistUrls: {
                //   "http://localhost:3000/": signature1,
                // },
            })
            sdkRef.current = socialLoginSDK
        }
        if (!sdkRef.current.provider) {
            // sdkRef.current.showConnectModal()
            sdkRef.current.showWallet()
            enableInterval(true)
        } else {
            setupSmartAccount()
        }
    }

    async function setupSmartAccount() {
        if (!sdkRef?.current?.provider) return
        sdkRef.current.hideWallet()
        setLoading(true)
        const web3Provider = new ethers.providers.Web3Provider(
            sdkRef.current.provider
        )
        try {
            const smartAccount = new SmartAccount(web3Provider, {
                activeNetworkId: ChainId.POLYGON_MAINNET,
                supportedNetworksIds: [ChainId.POLYGON_MAINNET],
                networkConfig: [
                    {
                        chainId: ChainId.POLYGON_MAINNET,
                        dappAPIKey: Biconomy_AA_Key,
                    },
                ],
            })
            await smartAccount.init()
            setSmartAccount(smartAccount)
            setLoading(false)
        } catch (err) {
            console.log("error setting up smart account... ", err)
        }
    }

    const logout = async () => {
        if (!sdkRef.current) {
            console.error("Web3Modal not initialized.")
            return
        }
        await sdkRef.current.logout()
        sdkRef.current.hideWallet()
        setSmartAccount(null)
        enableInterval(false)
    }

    const handleConnect = async () => {
        alert("Metamask Connect")
        await connect(metamaskConfig, {})
        await login()
    }

    const shorten = (text: any) => {
        return (
            text.substring(0, 6) +
            "..." +
            text.substring(text.length - 4, text.length)
        )
    }

    return (
        <div>
            <ul>
                <li>
                    <a href="#">DefiLens</a>
                </li>
                <li style={{float: "right", padding: "5px"}}>
                    <div>
                        {isOnWrongNetwork ? (
                            <button
                                className="rounded-lg bg-[#FF0000] text-[#ffffff] p-3"
                                onClick={() => switchNetwork?.(137)}
                            >
                                Switch Network
                            </button>
                        ) : (
                            smartAccount && (
                                <>
                                    <p>{smartAccount && smartAccount.address}</p>
                                    <button className="bg-[#000000] py-2  w-full text-center rounded-lg  mt-4">
                                        SCW Wallet:{" "}
                                        {(smartAccount && smartAccount.address)}
                                    </button>
                                    <p>{address}</p>
                                    <button className="bg-[#000000] py-2  w-full text-center rounded-lg  mt-4 mb-4">
                                        EOA Wallet: {(address)}
                                    </button>
                                </>
                            )
                        )}
                        {!smartAccount && !loading && (
                            <li>
                                <a onClick={handleConnect}>Login</a>
                            </li>
                        )}
                        {loading && (
                            <li>
                                <a>Loading account details...</a>
                            </li>
                        )}
                    </div>
                </li>
            </ul>
        </div>
    )
}

const detailsContainerStyle = css`
    margin-top: 10px;
`

// &:hover {
//   background-color: rgba(0, 0, 0, 0.2);
// };
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
`

const headerStyle = css`
    font-size: 44px;
`

const containerStyle = css`
    width: 900px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 100px;
`
