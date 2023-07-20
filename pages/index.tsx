import dynamic from "next/dynamic"
import {Suspense} from "react"
import MainForm from "../components/MainForm"

const Index = () => {
    const SocialLoginDynamic = dynamic(
        () => import("../components/Auth").then((res) => res.default),
        {
            ssr: false,
        }
    )

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <SocialLoginDynamic />
                <MainForm />
            </Suspense>
        </>
    )
}

export default Index
