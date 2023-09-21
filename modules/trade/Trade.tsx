import { tTrade } from "./types";

const Trade: React.FC<any> = ({}: tTrade) => (
    <div className="w-full flex justify-center items-center py-5">
        <h1 className="text-xl md:text-2xl lg:text-3xl text-center font-extrabold mb-7">
            Trade
        </h1>
    </div>
);

export default Trade;
