import { useState, useRef, useEffect } from "react";

import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { BigNumber as bg } from "bignumber.js";

import { FiCopy } from "react-icons/fi";
import { ImSpinner } from "react-icons/im";
import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";
import {
  useNetworkMismatch,
  useNetwork,
  useConnect,
  useAddress,
  metamaskWallet,
  useSigner,
} from "@thirdweb-dev/react";

import { Biconomy_AA_Key } from "../utils/keys";
import { useAppStore } from "../store/appStore";
import { rpscURLS } from "../utils/constants";
bg.config({ DECIMAL_PLACES: 5 })

export default function Home() {
  const {
    setSmartAccount, smartAccount, setCurrentProvider,
    scwBalance, eoaBalance, setScwBalance, setEoaBalance
  }: any = useAppStore((state) => state);
  const [interval, enableInterval] = useState(false);
  const sdkRef = useRef<SocialLogin | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const isOnWrongNetwork = useNetworkMismatch(); // Detect if the user is on the wrong network
  const [, switchNetwork] = useNetwork();
  const metamaskConfig = metamaskWallet();
  const connect = useConnect();
  const address: any = useAddress(); // Detect the connected address
  const signer: any = useSigner(); // Detect the connected address

  useEffect(() => {
    let configureLogin;
    if (interval) {
      configureLogin = setInterval(() => {
        if (!!sdkRef.current?.provider) {
          setupSmartAccount();
          clearInterval(configureLogin);
        }
      }, 1000);
    }
  }, [interval]);

  async function login() {
    if (!sdkRef.current) {
      const socialLoginSDK = new SocialLogin();
      // const signature1 = await socialLoginSDK.whitelistUrl(
      //   "http://localhost:3000/"
      // );
      await socialLoginSDK.init({
        chainId: ethers.utils.hexValue(ChainId.POLYGON_MAINNET),
        // whitelistUrls: {
        //   "http://localhost:3000/": signature1,
        // },
      });
      sdkRef.current = socialLoginSDK;
    }
    if (!sdkRef.current.provider) {
      // sdkRef.current.showConnectModal()
      sdkRef.current.showWallet();
      enableInterval(true);
    } else {
      setupSmartAccount();
    }
  }

  async function setupSmartAccount() {
    if (!sdkRef?.current?.provider) return;
    sdkRef.current.hideWallet();
    setLoading(true);
    const web3Provider = new ethers.providers.Web3Provider(
      sdkRef.current.provider
    );
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
      });
      await smartAccount.init();
      setSmartAccount(smartAccount);
      setLoading(false);
      setCurrentProvider("Biconomy");

      let _scwBalance: any = await smartAccount.provider.getBalance(smartAccount.address)
      console.log('_scwBalance', _scwBalance, smartAccount, address)

      _scwBalance = bg(_scwBalance.toString()).dividedBy(bg(10).pow(18))
      // _eoabalance = bg(_eoabalance.toString()).dividedBy(bg(10).pow(18))
      console.log('_scwBalance', _scwBalance)
      // console.log('_eoabalance', _eoabalance)

      setScwBalance(_scwBalance.toString())
      // setEoaBalance(_eoabalance)

    } catch (err) {
      console.log("error setting up smart account... ", err);
    }
  }

  const logout = async () => {
    if (!sdkRef.current) {
      console.error("Web3Modal not initialized.");
      return;
    }
    await sdkRef.current.logout();
    sdkRef.current.hideWallet();
    setSmartAccount(null);
    enableInterval(false);
  };

  const handleConnect = async () => {
    await connect(metamaskConfig, {});
    await login();
    const provider = new ethers.providers.JsonRpcProvider(rpscURLS['109'])
    let _eoabalance: any = await provider.getBalance(address)
    console.log('_eoabalance', _eoabalance)
    _eoabalance = bg(_eoabalance.toString()).dividedBy(bg(10).pow(18))
    console.log('_eoabalance', _eoabalance)
    setEoaBalance(_eoabalance.toString())
  };

  const copyToClipboard = (id: any) => {
    navigator.clipboard.writeText(id);

    // Alert the copied text
    toast.success("Wallet address Copied");
  };

  const buttonStyle =
    "bg-primary-600 hover:bg-primary-700 py-3 px-8 rounded-lg text-primary-100 font-medium border-b-4 border-primary-800 hover:border-primary-900 transition duration-300";

  return (
    <div>
      <ul className="bg-primary-950 p-2 shadow-md shadow-secondary-500">
        <li>
          <a href="#" className="font-bold text-2xl hover:bg-transparent">
            ChainPing
          </a>
        </li>
        <li style={{ float: "right", padding: "5px" }}>
          <div>
            {isOnWrongNetwork ? (
              <button
                className="bg-error-600 hover:bg-error-700 py-3 px-8 rounded-lg text-error-100 font-medium border-b-4 border-error-800 hover:border-error-900 transition duration-300 mx-2"
                onClick={() => switchNetwork?.(137)}
              >
                Switch Network
              </button>
            ) : (
              smartAccount &&
              !loading && (
                <div className="flex flex-wrap justify-start items-center gap-3 text-base">
                  <button
                    className={`${buttonStyle} flex justify-center items-center gap-2`}
                  >
                    SCW :{" "}
                    <span className="text-sm font-medium">
                      {smartAccount &&
                        smartAccount.address.slice(0, 4) +
                          ".." +
                          smartAccount.address.slice(-3) + " : (" + scwBalance + " Polygon)" }
                    </span>
                    <FiCopy
                      onClick={() => copyToClipboard(smartAccount.address)}
                    />
                  </button>

                  <button
                    className={`${buttonStyle} flex justify-center items-center gap-2`}
                  >
                    EOA :
                    <span className="text-sm font-medium">
                      {smartAccount && address?.slice(0, 4) + ".." + address?.slice(-3) + " : (" + eoaBalance + " Polygon) "}
                    </span>
                    <FiCopy onClick={() => copyToClipboard(address)} />
                  </button>
                </div>
              )
            )}
            {!smartAccount && !loading && (
              <li>
                <button
                  className={`${buttonStyle} flex justify-center items-center gap-2`}
                  onClick={handleConnect}
                >
                  <svg
                    className="h-4 w-4 text-light"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />{" "}
                    <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5" />{" "}
                    <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5" />
                  </svg>
                  Connect
                </button>
              </li>
            )}
            {loading && (
              <button
                className={`${buttonStyle} flex justify-center items-center gap-2`}
              >
                <ImSpinner className="animate-spin h-5 w-5" />
                Loading account details...
              </button>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
}
