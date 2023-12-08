const fs = require('fs')
const path = require('path')
const readline = require('readline')

async function contractAt(name, address, provider) {
  let contractFactory = await ethers.getContractFactory(name)
  if (provider) {
    contractFactory = contractFactory.connect(provider)
  }
  return await contractFactory.attach(address)
}

async function sendTxn(txnPromise, label) {
  const txn = await txnPromise
  console.info(`Sending ${label}...`)
  await txn.wait()
  console.info(`✅ Sent! tx: ${txn.hash}`)
  return txn
}

async function trySendTxn(txnPromise, label) {
  const txn = await txnPromise
  console.info(`Try ${label}...`)
  await txn.wait()
  console.info(`✅ Success`)
  return txn
}

function getAbsolutePath(inputPath) {
  return path.resolve(inputPath)
}

function isFileExist(filePath) {
  return fs.existsSync(filePath)
}

function readJsonContent(filePath) {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath))
  }
  return {}
}

function toETH(amount) {
  return ethers.utils.formatEther(amount)
}

function toWei(amount) {
  return ethers.utils.parseEther(amount + '')
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const impersonateAddress = async (address) => {
  const hre = require('hardhat')
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [address],
  })
  const signer = await ethers.provider.getSigner(address)
  signer.address = signer._address
  return signer
}

module.exports = {
  contractAt,
  sendTxn,
  trySendTxn,
  getAbsolutePath,
  isFileExist,
  readJsonContent,
  toETH,
  toWei,
  sleep,
  impersonateAddress,
}
