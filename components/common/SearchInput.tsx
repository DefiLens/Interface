// import React from 'react'

// const SearchInput: React.FC<any> = () => {
//     return (
//         <div className="w-full flex justify-start items-center gap-2 bg-N0 border-2 border-B50 rounded-md py-2 px-5">
//             <input
//                 type="text"
//                 value={showFromSelectionMenu ? filterFromToken : filterToToken}
//                 onChange={
//                     showFromSelectionMenu
//                         ? (e) => setFilterFromToken(e.target.value)
//                         : (e) => setFilterToToken(e.target.value)
//                 }
//                 placeholder="Search by Protocol"
//                 className="w-full text-sm md:text-base outline-none placeholder-B75 text-B100"
//             />
//             <AiOutlineSearch />
//         </div>
//     )
// }

// export default SearchInput



import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = "Search" }) => {
    return (
        <div className="w-full flex justify-start items-center gap-2 bg-N0 border-2 border-B50 rounded-md py-2 px-5">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full text-sm md:text-base outline-none placeholder-B75 text-B100"
            />
            <AiOutlineSearch />
        </div>
    );
};

export default SearchInput;
