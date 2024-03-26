import { email, github, telegram, twitter, web } from "../../assets/images";
import Footer from "./Footer";
import { tSocialHandle } from "./types";

const FooterContainer: React.FC<any> = () => {

  const SocialHandles: tSocialHandle[] = [
    {
      icon: telegram,
      key: 'telegram',
      href: 'https://t.me/rksunny',
    },
    {
      icon: twitter,
      key: 'twitter',
      href: 'https://twitter.com/DefiLensTech',
    },
    {
      icon: email,
      key: 'email',
      href: 'mailto:radadiyasunny970@gmail.com',
    },
    {
      icon: github,
      key: 'github',
      href: 'https://github.com/sunnyRK',
    },
    {
      icon: web,
      key: 'web',
      href: 'https://defilens.tech/',
    },

  ];

  return (
    <Footer
      SocialHandles={SocialHandles}
    />
  )
};

export default FooterContainer;
