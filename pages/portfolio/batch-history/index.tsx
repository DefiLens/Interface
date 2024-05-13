import MetaTags from "../../../components/Metatags";
import BatchHistoryContainer from "../../../modules/portfolio/batch-history/BatchHistoryContainer";
import { metadata } from "../../../utils/constants";

const BatchHistory: React.FC = () => (
    <>
        <MetaTags title={`Batching History | ${metadata.APP_NAME}`} />
        <BatchHistoryContainer />
    </>
);

export default BatchHistory;
