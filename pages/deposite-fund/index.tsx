import MetaTags from "../../components/Metatags";
import TransferContainer from "../../modules/transfer/TransferContainer";
import { metadata } from "../../utils/constants";

const Transfer: React.FC<{}> = () => (
    <>
        <MetaTags title={`Transfer Fund | ${metadata.APP_NAME}`} />
        <TransferContainer />
    </>
);

export default Transfer;
