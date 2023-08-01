import dynamic from "next/dynamic"
import {Suspense} from "react"
import MainForm from "../components/MainForm"
import {Tab, Tabs, TabList, TabPanel} from "react-tabs"
import {css} from "@emotion/css"
import Transfer from "../components/Transfer"

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
                <Tabs>
                    <TabList className={tabcss}>
                        <Tab className={tab}>Cross Chain Defi</Tab>
                        <Tab className={tab}>
                            Transfer Funds
                        </Tab>
                    </TabList>
                    <TabPanel>
                        <MainForm />
                    </TabPanel>
                    <TabPanel>
                        <Transfer />
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

const tab = css`
    border: 1px solid rgba(0, 0, 0, 0.8);
    padding: 15px;
`
