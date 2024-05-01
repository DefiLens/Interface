import { iBatchHistory } from "../types";
import { formatDate } from "../../../utils/helper";
import { NETWORK_LIST } from "../../../utils/data/network";
import Image from "next/image";
import CopyButton from "../../../components/common/CopyButton";
import { useEffect, useState } from "react";
import { iPortfolio, usePortfolioStore } from "../../../store/Portfolio";
import axios from "axios";
import { Button } from "../../../components/Button";
import { useAddress } from "@thirdweb-dev/react";
import { iGlobal, useGlobalStore } from "../../../store/GlobalStore";

interface BatchHistoryProps {
    transactions: iBatchHistory[];
    smartAccountAddress: string;
}

interface Chain {
    chainName: string;
    value: string;
}

interface FilterSelectionProps {
    dropdown?: boolean;
}

const FilterSelection: React.FC<FilterSelectionProps> = ({ dropdown = false }) => {
    const { chainName, setChainName }: iPortfolio = usePortfolioStore((state) => state);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setChainName(e.target.value);
    };

    const handleButtonClick = (chainName: string) => {
        setChainName(chainName);
    };

    const chains: Chain[] = [
        { chainName: "All", value: "" }, // All Chains
        { chainName: "Polygon", value: "polygon" }, // Polygon (Matic)
        { chainName: "Base", value: "base" }, // Base
        { chainName: "Optimism", value: "optimism" }, // Optimism
    ];

    return (
        <div className="">
            {dropdown ? (
                <div className="text-N20 text-lg bg-GR1 border rounded-lg px-2 cursor-pointer shadow-lg">
                    <select
                        value={chainName}
                        onChange={handleSelectChange}
                        className="bg-transparent py-2 cursor-pointer outline-none"
                    >
                        {chains.map((chain) => (
                            <option
                                key={chain.value}
                                value={chain.value}
                                className="bg-N20-300 py-2 px-4 border-none rounded-lg text-B100"
                            >
                                {chain.chainName}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                <div
                    className="w-full flex items-center gap-3 overflow-scroll"
                    style={{ scrollbarWidth: "none" }}
                >
                    {chains.map((chain) => (
                        <button
                            key={chain.chainName}
                            onClick={() => handleButtonClick(chain.value)}
                            className={`py-2 px-4 rounded-lg border border-B50 hover:bg-N50 ${
                                chainName === chain.value ? "bg-GR1 text-N20 border-none" : "bg-N40 text-B100"
                            }`}
                        >
                            {chain.chainName}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// const TokenList = () => {
//     const [tokenData, setTokenData] = useState([]);

//     useEffect(() => {
//       const fetchTokenData = async () => {
//         try {
//           const authToken = process.env.NEXT_PUBLIC_ZERION_API_KEY;
//           const response = await axios.get(
//             `https://api.zerion.io/v1/fungibles/?currency=usd&filter[implementation_chain_id]=polygon&page[1]=100&sort=-market_data.market_cap`,
//             {
//               headers: {
//                 Accept: 'application/json',
//                 Authorization: `Basic ${authToken}`,
//               },
//             }
//           );
//           setTokenData(response.data.data);
//         } catch (error) {
//           console.error('Error fetching token data:', error);
//         }
//       };
  
//       fetchTokenData();
//     }, []);
    
//   return (
//     <div className="flex flex-col gap-4">
//       {tokenData?.map((token, index) => (
//         <TokenCard key={index} token={token} />
//       ))}
//     </div>
//   );
// };

// const TokenCard = ({ token }) => {
//   return (
//     <div className="p-4 bg-white shadow-lg rounded-lg transition duration-300 transform hover:scale-105">
//     <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
//       {token.attributes.icon ? (
//         <img className="h-10 w-10" src={token.attributes.icon.url} alt={token.attributes.name} />
//       ) : (
//         <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-700 text-white text-sm">
//           {token.attributes.name.substring(0, 3).toUpperCase()}
//         </div>
//       )}
//       {token.attributes.name} ({token.attributes.symbol})
//     </h2>
//     {/* <p className="text-gray-500">{token.attributes.symbol}</p> */}
//     <div className="flex justify-between mt-4">
//       <p>Total Supply: ${token.attributes.market_data.price}</p>
//       <p>Market Cap: {token.attributes.market_data.market_cap}</p>
//     </div>
//     <div className="mt-4">
//       <ul className="flex space-x-4">
//         {token.attributes.external_links.map((link, index) => (
//           <li key={index}>
//             <a
//               href={link.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-500 hover:underline"
//             >
//               {link.name}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   </div>
  
//   );
// };

// const AddressToken = ()=>{

//     const [tokenData, setTokenData] = useState([]);
//     const address = useAddress();
//     const {
//         smartAccountAddress,
//     }: iGlobal = useGlobalStore((state) => state);

//     useEffect(() => {
//       const fetchTokenData = async () => {
//         try {
//           const authToken = process.env.NEXT_PUBLIC_ZERION_API_KEY;
//           const response = await axios.get(
//             `https://api.zerion.io/v1/wallets/${smartAccountAddress}/positions/?filter[positions]=&currency=usd&filter[trash]=&sort=`,
//             {
//               headers: {
//                 Accept: 'application/json',
//                 Authorization: `Basic ${authToken}`,
//               },
//             }
//           );
//           console.log(response.data.data); 
//           setTokenData(response.data.data);
//         } catch (error) {
//           console.error('Error fetching token data:', error);
//         }
//       };
   
//       if(address || smartAccountAddress){
//           fetchTokenData();
//         }
//     }, [address, smartAccountAddress]);
//     return ( 
//         <>
//             <div className="flex flex-col w-[40rem]">
//                 {tokenData?.map((token, index) => (
//                     <AddressTokenCard key={index} token={token} />
//                 ))}
//             </div>
//           </>
//     )
// }

// const AddressTokenCard = ({ token }) => {
//     const { name, symbol, icon, fungible_info, value, price, changes, relationships } = token.attributes;
  
//     return (
//         <div className="w-full p-4 bg-white shadow-lg rounded-lg transition duration-300 transform hover:scale-105 flex row items-center gap-2">
//             <div>
//           {token?.attributes?.fungible_info?.icon?.url ? (
//             <img className="h-12 min-w-12" src={token.attributes.fungible_info.icon.url} alt={name} />
//           ) : (
//             <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-700 text-white text-sm">
//               {token.attributes.fungible_info.name.substring(0, 3).toUpperCase()}
//             </div>
//           )}

//           </div>
//           <div className="flex flex-col w-full">
//                 <h2 className="text-lg font-semibold flex items-center gap-2">{token.attributes.fungible_info.name}</h2>

//             <div className="flex items-center justify-between w-full">
//                 <p>{parseFloat(token.attributes.quantity.numeric).toFixed(5)} {token.attributes.fungible_info.symbol} · ${parseFloat(price).toFixed(5)}</p>
//             </div>
//           </div>
//           <div>
//           <p>{value && `${parseFloat(value)}`}</p>

//           </div>
       
//       </div>
//     );
//   };
  
const BatchHistory: React.FC<BatchHistoryProps> = ({ transactions, smartAccountAddress }) => {
    return (
        <div className="w-full flex flex-col justify-center items-center gap-10 p-4">
            <div className="max-w-6xl sticky h-[65px] top-0 z-20 w-full mx-auto bg-N0 shadow-lg rounded-md p-3 flex justify-between gap-2">
                <FilterSelection />
                <FilterSelection dropdown={true} />
            </div>
            {/* <AddressToken/>
            <TokenList/> */}
            <div className="max-w-6xl w-full mx-auto bg-N0 shadow-lg rounded-md p-3">
                <h1 className="text-2xl font-bold mb-4">Transaction History</h1>

                <div className="flex flex-col gap-10">
                    {transactions &&
                        transactions.length > 0 ?
                        transactions.map((parentTransaction: iBatchHistory, index: number) => (
                            <div key={index}>
                                <h2 className="text-xl font-semibold">#{index + 1} Batch</h2>
                                <div className="flex justify-between items-end mb-4">
                                    <div className="flex items-center gap-3">
                                        <p className="font-semibold">
                                            Transaction Hash:{"  "}
                                            {
                                                parentTransaction.txHash
                                                    ? parentTransaction.txHash.slice(0, 20) +
                                                      "......." +
                                                      parentTransaction.txHash.slice(-8)
                                                    : "N/A" // Or any placeholder text you prefer
                                            }
                                        </p>
                                        <CopyButton copy={parentTransaction.txHash || ""} />
                                    </div>
                                    <div className="flex flex-col items-center gap-3">
                                        <p className="font-semibold">Total Amount: {parentTransaction.totalAmount}</p>
                                        <p className="font-semibold">Date: {formatDate(parentTransaction.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="table-auto border-collapse w-full">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2">From Network</th>
                                                <th className="px-4 py-2">From Protocol</th>
                                                <th className="px-4 py-2">From Token</th>
                                                <th className="px-4 py-2">To Network</th>
                                                <th className="px-4 py-2">To Protocol</th>
                                                <th className="px-4 py-2">To Token</th>
                                                <th className="px-4 py-2">Amount In</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parentTransaction.transactions.map((transaction) => {
                                                // Find the corresponding network object for fromNetwork
                                                const fromNetworkObj = NETWORK_LIST.find(
                                                    (network) =>
                                                        network.chainName.toLowerCase() ===
                                                        transaction.fromNetwork.toLowerCase()
                                                );

                                                // Find the corresponding network object for toNetwork
                                                const toNetworkObj = NETWORK_LIST.find(
                                                    (network) =>
                                                        network.chainName.toLowerCase() ===
                                                        transaction.toNetwork.toLowerCase()
                                                );

                                                return (
                                                    <tr key={transaction._id}>
                                                        <td className="border px-4 py-2 text-center">
                                                            {fromNetworkObj ? (
                                                                <div className="flex gap-2 items-center">
                                                                    <Image
                                                                        src={fromNetworkObj.icon}
                                                                        alt={fromNetworkObj.key}
                                                                        className="h-8 w-8 rounded-full"
                                                                    />
                                                                    {fromNetworkObj.key}
                                                                </div>
                                                            ) : null}
                                                        </td>
                                                        <td className="border px-4 py-2 text-center">
                                                            {transaction.fromProtocol}
                                                        </td>
                                                        <td className="border px-4 py-2 text-center">
                                                            {transaction.fromToken}
                                                        </td>
                                                        <td className="border px-4 py-2 text-center">
                                                            {toNetworkObj ? (
                                                                <div className="flex gap-2 items-center">
                                                                    <Image
                                                                        src={toNetworkObj.icon}
                                                                        alt={toNetworkObj.key}
                                                                        className="h-8 w-8 rounded-full"
                                                                    />
                                                                    {toNetworkObj.key}
                                                                </div>
                                                            ) : null}
                                                        </td>
                                                        <td className="border px-4 py-2 text-center">
                                                            {transaction.toProtocol}
                                                        </td>
                                                        <td className="border px-4 py-2 text-center">
                                                            {transaction.toToken}
                                                        </td>
                                                        <td className="border px-4 py-2 text-center">
                                                            {transaction.amountIn}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))
                        :
                        <>{transactions.message}</>
                        }
                </div>
            </div>
        </div>
    );
};

export default BatchHistory;
