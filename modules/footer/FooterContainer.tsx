import Footer from "./Footer";
import { socialHandles } from "../../utils/constants";

const FooterContainer: React.FC = () => {
  return (
    <Footer
      SocialHandles={socialHandles}
    />
  )
};

export default FooterContainer;
