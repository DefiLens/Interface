import React, { useRef, useState } from 'react';

import Image from 'next/image';

import { tSelectNetwork } from './types';
import useClickOutside from '../../hooks/useClickOutside';
import { iTrade, useTradeStore } from '../../store/TradeStore';
import { buttonStyle, NETWORK_LIST } from '../../utils/constants';

const SelectNetwork = ({
  switchOnSpecificChain,
}: tSelectNetwork) => {

  const selectNetworkRef = useRef(null);

  const {
    showSelectNetworkList,
    setShowSelectNetworkList,
    selectedFromNetwork,
  }: iTrade = useTradeStore((state) => state);
  
  const handleSelectNetwork = (data: any) => {
    setShowSelectNetworkList(!showSelectNetworkList);
    if (selectedFromNetwork.chainName !== data.chainName) {
      switchOnSpecificChain(data.chainName)
    }
  };

  useClickOutside([selectNetworkRef], () => {
    setShowSelectNetworkList(false);
  });


  return (
    <div className="z-50">
      <div
        className="flex justify-between items-center  cursor-pointer"
        onClick={() => setShowSelectNetworkList(!showSelectNetworkList)}
      >
        {selectedFromNetwork?.chainName ? (
            <div className="bg-slate-100 hover:bg-slate-300 active:bg-slate-400 rounded-full p-1">
              <Image
                src={selectedFromNetwork.icon}
                alt=""
                className="h-8 w-8 rounded-full cursor-pointer"
              />
            </div>
          ) : (
            <div  className={`${buttonStyle} border-primary-800 hover:border-primary-900 flex justify-center items-center gap-2`}>
              Select a Network
            </div>
          ) 
        }
      </div>

      <div
        className={`absolute right-12 my-2 ${showSelectNetworkList
            ? "max-h- opacity-100"
            : "max-h-0 opacity-0"
          } rounded-xl transition-all delay-100 duration-300 ease-linear`}
      >
        {showSelectNetworkList && (
          <div 
            ref={selectNetworkRef}
            className="w-48 flex flex-col gap-1 p-3 rounded-xl bg-slate-800 border-2 border-slate-700 shadow-md shadow-slate-950"
          >
            {NETWORK_LIST?.map((item) => {
              return (
                <div
                  key={item.chainName}
                  onClick={() => handleSelectNetwork(item)}
                  className="flex justify-start items-center gap-3 hover:bg-slate-950 p-2 rounded-full cursor-pointer"
                >
                  <Image
                    src={item.icon}
                    alt="logo"
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="text-sm md:text-base text-white">{item.key}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
export default SelectNetwork;