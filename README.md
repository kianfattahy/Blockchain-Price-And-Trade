# Blockchain Trading Bot

## Overview

The Blockchain Trading Bot is a powerful tool designed to interface directly with various blockchains and decentralized exchanges, bypassing traditional interfaces and providing a direct gateway to the blockchain using JavaScript.

![Liquidity Pool Interface](https://user-images.githubusercontent.com/94335877/145323880-29d34804-eef9-470e-afd0-ded8d8e2a977.png)

## Features

### Real-time Cryptocurrency Prices
- Fetches live cryptocurrency prices from Uniswap via the Infura API.
- Adaptable to various blockchains and exchanges for comprehensive price monitoring.

### Automated Trading
- Enables setting and executing stop orders based on price trends.
- Users can predetermine trading prices for specific token pairs across any liquidity pool.

### High Versatility
- Supports multiple blockchain networks, decentralized exchanges, and token pairs.
- Integrates with APIs from providers like Infura and Ankr for seamless blockchain interaction.
- Simply input the API's HTTP address and the desired token pair address to retrieve specific information.

## Usage Guide

### 1. API Configuration
To customize the bot for specific chains or exchanges:
- Acquire an API from providers like Infura or Ankr.
- Input the HTTP address of the chosen API into the `.env` file. For instance, to work with the Ethereum Mainnet on Infura, use its specific HTTP address.

### 2. Token Pair Address Setup
- Every token pair on a decentralized exchange has a unique address.
- Input this address into the `index.js` file. Ensure it corresponds to the exchange and blockchain you're interested in. For example, for the wETH/USDC pair on Uniswap, use its specific address.

### 3. Stop Orders and Swaps
- To perform actions like stop orders or swaps, input the private key of your wallet. This grants the bot permission to interface with the blockchain on your behalf.
- **Security Notice:** Your private key is sensitive information. Never share it, and ensure it's stored securely.

### 4. Trading
- Customize stop orders to execute at your preferred prices for any trading pair. Ensure the liquidity pool for the chosen pair has sufficient liquidity.
