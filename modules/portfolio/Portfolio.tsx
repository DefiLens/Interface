import { tPortfolio } from "./types";

const Portfolio: React.FC<any> = ({}: tPortfolio) => (
    <div className="w-full flex flex-col justify-center items-center gap-5 p-5 sm:p-10 md:p-14 lg:p-20">
        <h1 className="text-font-300 text-center text-xl md:text-2xl lg:text-4xl font-bold">
            Portfolio
        </h1>
    </div>
);

export default Portfolio;
