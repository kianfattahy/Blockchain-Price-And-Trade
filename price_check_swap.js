const uniABI = require(".IUniswapV2Pair.json");
const getBig = require("big.js");
const wssSetup = require("./wss_setup");
const ethers = require('ethers');


//insert the name of the swap EX: WETH/USDC
const swapID = "";
//insert the address of the pair that you wish to swap
const address = "";


//web3 contract 
const WSS = new wssSetup.web3WSS.eth.Contract(
    uniABI.abi,
    address
);

//call the getreserves function from Uniswap
const getReserves = async (ContractObj) => {
    const _reserves = await ContractObj.methods.getReserves().call();

    return [getBig(_reserves.reserve0), getBig(_reserves.reserve1)];
};



const sleep = (timeInMs) =>
    new Promise((resolve) => setTimeout(resolve, timeInMs));



const main = async () => {
    //keep getting the price at given instance
    while (true) {
        //call getReserves
        const [amtToken0, amtToken1] = await getReserves(HTTP);

        //display price at instant
        console.log(
            `Price ${swapID} : ${amtToken0.div(amtToken1).toString()}`
        );

        //decide how long to wait before retrieving and updating the price
        await sleep(5000);
    }
};

main();
