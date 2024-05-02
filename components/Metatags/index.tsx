import { FC } from "react";
import BasicTags from "./Tags/BasicsTags";
import SEOTags from "./Tags/SeoTags";

interface Props {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    username?: string;
}

const MetaTags: FC<Props> = (props) => {
    return (
        <>
            <BasicTags />
            <SEOTags {...props} />
        </>
    );
};

export default MetaTags;
