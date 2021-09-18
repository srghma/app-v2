import { ethers } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";
import { AVALANCHE_MAINNET_PARAMS } from "utils/constants/connectors";

// curl -X POST --data '{                                                                                                     <<<
//   "jsonrpc":"2.0",
//   "id"     :1,
//   "method" :"info.isBootstrapped",
//   "params": {
//       "chain":"X"
//   }
// }' -H 'content-type:application/json;' https://node.snowapi.net/ext/info

// {"jsonrpc":"2.0","result":{"isBootstrapped":true},"id":1}

const ProviderContext = createContext(null);

export function ProviderProvider({ children }) {
  const [loading,setLoading] = useState(true);
  const [provider,setProvider] = useState(null);

  const PRIVATENODE = process.env.PRIVATENODE;

  const nodeIsHealthy = async (url) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    var raw = JSON.stringify({"jsonrpc":"2.0","id":1,"method":"health.getLiveness"});
  
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    try{
      const response = await fetch(`${url}/ext/health`, requestOptions);
      const bodyResponse = await response.json(); 
      return bodyResponse.result?.healthy;
    }catch(error){
      console.log(error);
      return false;
    }
  }

  useEffect(() => {
    const loadProviders = async () => {
      if(loading){
        //check if our node is healthy
        const nodeHealthy = await nodeIsHealthy(PRIVATENODE);
        if(nodeHealthy){
          // could use MiniRpcProvider
          // https://github.com/NoahZinsmeister/web3-react/blob/f5c91a368a7cc15d0ae801288212c384449eb464/packages/network-connector/src/index.ts#L22

          // -----------------------
          // IF IT WAS eth, could use ethers.getDefaultProvider

          // It is highly recommended that you provide an API for each service, to maximize your applications performance.

          // Passing API Keys into getDefaultProvider
          // // Use the mainnet
          // const network = "homestead";
          
          // // Specify your own API keys
          // // Each is optional, and if you omit it the default
          // // API key for that service will be used.
          // const provider = ethers.getDefaultProvider(network, {
          //     etherscan: YOUR_ETHERSCAN_API_KEY,
          //     infura: YOUR_INFURA_PROJECT_ID,
          //     // Or if using a project secret:
          //     // infura: {
          //     //   projectId: YOUR_INFURA_PROJECT_ID,
          //     //   projectSecret: YOUR_INFURA_PROJECT_SECRET,
          //     // },
          //     alchemy: YOUR_ALCHEMY_API_KEY,
          //     pocket: YOUR_POCKET_APPLICATION_KEY
          //     // Or if using an application secret key:
          //     // pocket: {
          //     //   applicationId: ,
          //     //   applicationSecretKey:
          //     // }
          // });

          // -----------------------

          // export class JsonRpcProvider extends BaseProvider {
          // export class StaticJsonRpcProvider extends JsonRpcProvider {
          // https://github.com/ethers-io/ethers.js/blob/ce8f1e4015c0f27bf178238770b1325136e3351a/packages/providers/src.ts/url-json-rpc-provider.ts#L28


          const privateProvider = new ethers.providers.
            StaticJsonRpcProvider(`${PRIVATENODE}/ext/bc/C/rpc`);

          //do a quick call to check if the node is sync
          try {
            //avalanche burn address
            await privateProvider.getBalance('0x0100000000000000000000000000000000000000');
            setProvider(privateProvider);
          } catch (error) {
            console.log(error);
            // IF our node is not running - use avalanche main
            setProvider(
              new ethers.providers.
                StaticJsonRpcProvider(AVALANCHE_MAINNET_PARAMS.rpcUrls[0])
            );
          }
        }else{
          setProvider(
            new ethers.providers.
              StaticJsonRpcProvider(AVALANCHE_MAINNET_PARAMS.rpcUrls[0])
          );
        }
        setLoading(false);
      }
    }
    loadProviders();
  },[loading]);
  

  return (
    <ProviderContext.Provider
      value={{
        provider
      }}
    >
      {children}
    </ProviderContext.Provider>
  )
}

export function useProvider() {
  const context = useContext(ProviderContext)
  if (!context) {
    throw new Error('Context not Loaded yet!')
  }

  const {
    provider
  } = context

  return {
    provider
  }
}