import MetaTags from "../../components/Metatags";
import MigrateAssetContainer from "../../modules/migrate-asset/MigrateAssetContainer";
import { metadata } from "../../utils/constants";

const MigrateAsset: React.FC<{}> = () => (
    <>
        <MetaTags title={`Migrate Assets | ${metadata.APP_NAME}`} />
        <MigrateAssetContainer />
    </>
);

export default MigrateAsset;
