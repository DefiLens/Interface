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
            <div className="rounded-full p-1">
              <Image
                src={selectedFromNetwork.icon}
                alt=""
                className="h-8 w-8 rounded-full cursor-pointer"
              />
            </div>
          ) : (
            <div
              className="bg-button-100 py-2 px-5 rounded-lg text-font-100 font-medium border-b-4 transition duration-300 border-button-300 hover:border-button-400 flex justify-center items-center gap-2"
            >
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
            className="w-48 flex flex-col gap-1 p-3 rounded-xl bg-backgound-300 border-2 border-backgound-600 shadow shadow-backgound-600"
          >
            {NETWORK_LIST?.map((item) => {
              return (
                <div
                  key={item.chainName}
                  onClick={() => handleSelectNetwork(item)}
                  className="flex justify-start items-center gap-3 hover:bg-backgound-100 p-2 rounded-full cursor-pointer"
                >
                  <Image
                    src={item.icon}
                    alt="logo"
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="text-sm md:text-base text-font-100">{item.key}</div>
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