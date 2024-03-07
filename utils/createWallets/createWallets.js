const path = require('path');
const createObjectCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');
const ethers = require('ethers');

const walletCSVPath = path.join(__dirname, `../../.wallets/walleti.csv`)
const accounts = 100

createWalletcsv()
function createWalletcsv() {
  let data = Array(accounts).fill('_').map((_, index) => {
    const wallet = ethers.Wallet.createRandom()
    const { privateKey, address } = wallet
    return {
      index: index,
      privateKey: privateKey,
      address: address
    }
  })

  let csvWriter = createObjectCsvWriter({
    path: walletCSVPath,
    header: [
      { id: 'index', title: 'fuelAddress' },
      { id: 'address', title: 'address' },
      { id: 'privateKey', title: 'privateKey' },
    ],
  });

  csvWriter.writeRecords(data)
    .then(() => {
      console.log('...Done');
    });


}