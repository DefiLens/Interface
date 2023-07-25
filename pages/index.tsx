import dynamic from "next/dynamic"
import {Suspense} from "react"
import MainForm from "../components/MainForm"
import PimlicoLogin from "../components/pimlicoLogin"
import {Tab, Tabs, TabList, TabPanel} from "react-tabs"
import {css} from "@emotion/css"
import TokenRecipes from "../components/TokenRecipes"

const Index = () => {
    const SocialLoginDynamic = dynamic(
        () => import("../components/Auth").then((res) => res.default), {
            ssr: false,
        }
    )

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <SocialLoginDynamic />
                {/* <PimlicoLogin /> */}
                {/* <MainForm /> */}
                <Tabs>
                    <TabList className={tabcss}>
                        <Tab>Cross Chain Defi</Tab>
                        <Tab>One-Click Defi recipes</Tab>
                    </TabList>
                    <TabPanel>
                        <MainForm />
                    </TabPanel>
                    <TabPanel>
                        <TokenRecipes />
                    </TabPanel>
                    <TabPanel>
                        <TokenRecipes />
                    </TabPanel>
                </Tabs>
            </Suspense>
        </>
    )
}

export default Index

const tabcss = css`
    background-color: grey;
    font-size: 30px;
    text-align: center;
`
