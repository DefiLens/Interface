import {createContext} from "react"

const ChainContext = createContext({
    selectedChain: "",
    setSelectedChain: (chain: string) => {},
    selectedChainId: "",
    setSelectedChainId: (chainId: string) => {},
})

export default ChainContext
