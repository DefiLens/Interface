import { tDashboard } from "./types";

const Dashboard: React.FC<tDashboard> = ({}) => (
    <div className="w-full flex flex-col justify-center items-center gap-5 p-5 sm:p-10 md:p-14 lg:p-20 pt-14 md:pt-24 lg:pt-28">
        <h1 className="text-font-300 text-center text-xl md:text-2xl lg:text-4xl font-bold">
            Simplifying Defi Trading Experience
        </h1>
        <div className="animate-heading text-center text-4xl md:text-6xl lg:text-7xl font-extrabold lg:font-black py-6">
            Smart Batching via one-click
        </div>
        <h1 className="text-center text-xl md:text-2xl lg:text-4xl font-bold text-orange-600">
            Base | Arbitrum | Optimism | Ethereum | Polygon | Avalanche
        </h1>
        <h3 className="text-font-400 text-center text-sm md:text-base lg:text-lg font-semibold px-3 md:px-12">
            DefiLens is pioneering a platform that streamlines trading activities. To offering the ease of trading
            experience and swift portfolio management to users, Defilens provide a solutions like cross-chain trading
            and efficiently refinancing defi positions using smart batching strategies.
        </h3>
    </div>
);

export default Dashboard;
