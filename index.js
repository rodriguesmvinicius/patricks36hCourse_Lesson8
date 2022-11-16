const { ethers } = require("ethers");
const { abi } = require("./contracts/FundMe.json");
const { FUNDME_CONTRACT } = require("./constants");
const { Web3 } = require("web3");

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (window.ethereum.isConnected())
      document.getElementById("connectButton").innerHTML =
        "Connected:" + accounts;
  } else {
    document.getElementById("connectButton").innerHTML =
      "Please install MetaMask";
  }
}

async function withdraw() {
  console.log(`Withdrawing...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(FUNDME_CONTRACT, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  } else {
    document.getElementById("connectButton").innerHTML =
      "Please install MetaMask";
  }
}

async function fund(ethAmount) {
  console.log(`Funding with ${ethAmount}...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(FUNDME_CONTRACT, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  } else {
    document.getElementById("connectButton").innerHTML =
      "Please install MetaMask";
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      console.log(FUNDME_CONTRACT);
      const balance = await provider.getBalance(FUNDME_CONTRACT);
      console.log(ethers.utils.formatEther(balance));
      document.getElementById("treasurelabel").innerHTML =
        "Current Treasure: " + ethers.utils.formatEther(balance);
    } catch (error) {
      console.log(error);
    }
  } else {
    document.getElementById("connectButton").innerHTML =
      "Please install MetaMask";
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations. `
      );
      getBalance();
      resolve();
    });
  });
}

module.exports = {
  connect,
  withdraw,
  fund,
  getBalance,
};
