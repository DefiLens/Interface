import { useState, useRef, useEffect } from "react";

import { ethers } from "ethers";
import { toast } from "react-hot-toast";

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
} from "@thirdweb-dev/react";

import { Biconomy_AA_Key } from "../utils/keys";
import { useAppStore } from "../store/appStore";

export default function Home() {
  const { setSmartAccount, smartAccount }: any = useAppStore((state) => state);
  const [interval, enableInterval] = useState(false);
  const sdkRef = useRef<SocialLogin | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const isOnWrongNetwork = useNetworkMismatch(); // Detect if the user is on the wrong network
  const [, switchNetwork] = useNetwork();
  const metamaskConfig = metamaskWallet();
  const connect = useConnect();
  const address = useAddress(); // Detect the connected address

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

  // useEffect(() => {
  //     login()
  // }, [address])

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
    alert("Metamask Connect");
    await connect(metamaskConfig, {});
    await login();
  };

  const copyToClipboard = (id: any) => {
    navigator.clipboard.writeText(id);

    // Alert the copied text
    toast.success("Wallet address Copied");
  };

  const buttonStyle =
    "bg-indigo-600 hover:bg-indigo-700 py-3 px-8 rounded-lg text-indigo-100 font-medium border-b-4 border-indigo-800 hover:border-indigo-900 transition duration-300";

  return (
    <div>
      <ul className="bg-[#080829] p-2 shadow-md shadow-gray-500">
        <li>
          <a href="#" className="font-bold text-2xl hover:bg-transparent">
            ChainPing
          </a>
        </li>
        <li style={{ float: "right", padding: "5px" }}>
          <div>
            {isOnWrongNetwork ? (
              <button
                className="bg-red-600 hover:bg-red-700 py-3 px-8 rounded-lg text-red-100 font-medium border-b-4 border-red-800 hover:border-red-900 transition duration-300 mx-2"
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
                          smartAccount.address.slice(-3)}
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
                      {address?.slice(0, 4) + ".." + address?.slice(-3)}
                    </span>
                    <FiCopy onClick={() => copyToClipboard(address)} />
                  </button>
                </div>
              )
            )}
            {!smartAccount && !loading && (
              <li>
                <button className={buttonStyle} onClick={handleConnect}>
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
