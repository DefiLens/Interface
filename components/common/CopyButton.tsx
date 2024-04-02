import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

interface CopyButtonProps {
    copy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ copy }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 3000); // Hide tick icon after 3 seconds
    };

    return (
        <button onClick={() => copyToClipboard(copy)}>
            {copied ? (
                <FiCheck size="18px" className="text-success-600 active:text-B200" />
            ) : (
                <FiCopy size="18px" className="text-B100 active:text-B200" />
            )}
        </button>
    );
};

export default CopyButton;
