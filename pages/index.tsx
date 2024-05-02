import { metadata } from "../utils/constants";
import MetaTags from "../components/Metatags";
import TradeContainer from "../modules/trade/TradeContainer";

const Index = () => (
    <>
        <MetaTags
          title={`${metadata.APP_NAME} is in private beta | ${metadata.APP_NAME}`}
        />
        <TradeContainer />
    </>
);

export default Index;
