import Web3 from 'web3';
import { NFTStorage } from 'nft.storage';
import FrankensteinTexts from './contracts/FrankensteinTexts.json';

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZGZDk4Qzg4MzU5YTRDNENBYjkwNDVhNGVlZTAxYWFhNDE2ODRGRWIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzNDY4MjA0ODUzMywibmFtZSI6IlByaW1hIn0.cUwmpnPU9F8erl5xLg0AqSG0OQAqv0JGug0N5SHnU9w';
const client = new NFTStorage({ token: apiKey });

const getWeb3 = () => {
  return new Web3('http://localhost:9545');
};

const getContract = async web3 => {
  const networkId = await web3.eth.net.getId();
  const contractDeployment = FrankensteinTexts.networks[networkId];
  return new web3.eth.Contract(
    FrankensteinTexts.abi,
    contractDeployment && contractDeployment.address
  );
};

export { getWeb3, getContract };

export default client;