import MetaTags from "../../components/Metatags";
import PortfolioContainer from "../../modules/portfolio/PortfolioContainer";
import { metadata } from "../../utils/constants";

const Portfolio: React.FC<{}> = () => (
    <>
        <MetaTags title={`Portfolio | ${metadata.APP_NAME}`} />
        <PortfolioContainer />
    </>
);

export default Portfolio;
