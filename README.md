# Blockchain-Price-And-Trade
After a while of using cryptocurrencies and DeFi tools through traditional interfaces, I became curious about how interactions with liquidity pools like the ones shown below could be established and automated without using a similar website. Thus, this bot was created to interact with the blockchain and exchanges directly using JavaScript.

<img width="1440" alt="Screen Shot 2021-12-08 at 9 33 52 PM" src="https://user-images.githubusercontent.com/94335877/145323880-29d34804-eef9-470e-afd0-ded8d8e2a977.png">

# View Prices
This bot is highly customizable, as it can be altered for a multitude of chains, decentralized exchanges, and token pairs. In order to do so, various APIs from providers such as Infura or Ankr are necessary to interact with a given blockchain. 

First, the HTTP address of the designated API must be inputted into the apprpriate field in the .env file. For example, if the user decides to use an Ethereum Mainnet API from Infura, then the HTTP address of that specific API must be used in order to view information about pairs on Uniswap that are on the Ethereum blockchain.

Next, the pair address of the tokens of interest must be inputted into the appropriate field in the index.js file. This pair address is unique to both the token pair and the decentralized exchange on which their liquidity pool exists. Thus, the pair address of wETH/USDC needs to be appropriate for Uniswap if the user wants to view what the price of the token pair is on Uniswap.

To execute stop orders or any kind of swap, the private key of the user's wallet must be inputted. This allows the program to interact with the blockchain with the user's wallet. Please note that this private key is very sensitive information and should never be shared with anyone. Stop orders can be customized to execute at any price that the user desires for any trading pair, provided that liquidity exists in the liquidity pool for the desired pair.
