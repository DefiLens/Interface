import React from "react";
import OnboardingPage from "../../modules/onboarding";
import MetaTags from "../../components/Metatags";
import { metadata } from "../../utils/constants";

const Onboarding: React.FC = () => (
    <>
        <MetaTags title={`Onboarding on ${metadata.APP_NAME}`} />
        <OnboardingPage />
    </>
);

export default Onboarding;
