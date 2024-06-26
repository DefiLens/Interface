import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../../../axiosInstance/axiosInstance";
import { CgSpinner } from "react-icons/cg";
import { tButton } from "../../../components/Button/types";
import Link from "next/link";
import toast from "react-hot-toast";
import { cn } from "../../../lib/utils";

const Button = ({ handleClick, isLoading = false, innerText, customStyle }: tButton) => (
    <button
        type="button"
        onClick={handleClick}
        className={cn(
            "w-full flex justify-center items-center gap-2 py-3 px-5 rounded-lg text-base md:text-lg font-bold transition duration-300",
            customStyle
        )}
    >
        {isLoading && <CgSpinner className="animate-spin h-7 w-7" />}
        {innerText}
    </button>
);

const JoinWaitlist = () => {
    const router = useRouter();
    const [step, setStep] = useState(1); // stepper
    const [email, setEmail] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState(null);

    // checking if user already visited
    useEffect(() => {
        if (localStorage.getItem("visited")) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    }, []);

    const handleJoinWaitlist = () => {
        setStep(2);
    };

    // email validation using regex
    const isValidEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    // Submitting the email: validation -> post req -> save in localStorage -> update stepper
    const handleSubmitEmail = async () => {
        setIsLoading(true);
        try {
            if (!isValidEmail(email)) {
                toast.error("Please enter a valid email address.");
                return;
            }
            const response = await axiosInstance.post(`/public/waitlist`, { email: email });
            setResponse(response.data.message);

            localStorage.setItem("visited", "true");
            localStorage.setItem("email", email);

            setIsLoading(false);
            setStep(3);
        } catch (error) {
            setIsLoading(false);
            console.error("Error submitting email:", error);
        }
    };

    // user wants to use simulation
    const trySimulation = () => {
        router.push("/");
        setIsOpen(false);
    };

    return (
        <div className={cn("fixed z-30 inset-0 overflow-y-auto", isOpen ? "block" : "hidden")}>
            <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm backdrop-filter"></div>
            <div className="relative flex items-center justify-center min-h-screen">
                <div className="flex flex-col bg-white rounded-lg shadow-lg p-8 max-w-[35rem] w-full relative">
                    {step === 1 && (
                        <>
                            <h2 className="text-3xl font-bold mb-1 text-gray-800 font-sans">Welcome to Defilens</h2>
                            <p className="text-base font-medium text-gray-500 mb-6">
                                Join the waitlist to become an early user of Defilens
                            </p>
                            <div className="flex flex-col gap-5 max-w-[30rem] w-full">
                                <Button
                                    handleClick={handleJoinWaitlist}
                                    isLoading={false}
                                    customStyle="bg-zinc-900 hover:bg-zinc-800 text-white"
                                    innerText="Join waitlist"
                                />
                                <Button
                                    handleClick={trySimulation}
                                    isLoading={false}
                                    customStyle="bg-zinc-100 text-black"
                                    innerText="Try Simulation"
                                />
                            </div>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <h2 className="text-3xl font-bold mb-6 text-gray-800 font-sans">Enter your Email</h2>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full rounded-lg px-4 py-2 mb-4 border border-gray-700 outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button
                                handleClick={handleSubmitEmail}
                                isLoading={isLoading}
                                customStyle="bg-zinc-900 hover:bg-zinc-800 text-white"
                                innerText={isLoading ? "Submitting..." : "Submit"}
                            />
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <h2 className="text-3xl font-bold mb-6 text-gray-800 font-sans">{response}</h2>
                            <Button
                                handleClick={trySimulation}
                                isLoading={false}
                                customStyle="bg-zinc-900 hover:bg-zinc-800 text-white"
                                innerText="Try Simulation"
                            />
                        </>
                    )}
                    <p className="text-slate-500 text-sm font-medium w-full mt-6 font-sans">
                        Note: Please contact us on our{" "}
                        <Link
                            className="text-slate-600 underline underline-offset-2"
                            href="https://t.me/defilenscommunity"
                            target="_blank"
                        >
                            telegram community
                        </Link>{" "}
                        if you need help.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JoinWaitlist;
