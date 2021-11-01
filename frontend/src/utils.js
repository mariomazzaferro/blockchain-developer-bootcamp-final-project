import Web3 from 'web3';
import { NFTStorage } from 'nft.storage';
import FrankieTexts from './contracts/FrankieTexts.json';
require('dotenv').config();

const apiKey = process.env.REACT_APP_API_KEY;
const client = new NFTStorage({ token: apiKey });

const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if(window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else if(window.web3) {
        resolve(window.web3);
      } else {
        reject('Please install Metamask')
      }
    });
  });
};

const getContract = async web3 => {
  const networkId = await web3.eth.net.getId();
  const contractDeployment = FrankieTexts.networks[networkId];
  return new web3.eth.Contract(
    FrankieTexts.abi,
    contractDeployment && contractDeployment.address
  );
};

export { getContract, getWeb3, client };