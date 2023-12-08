const { contractAt, sendTxn, getAbsolutePath, isFileExist, readJsonContent, toETH, toWei, sleep } = require('./lib/helper')
const { config } = require('../config')

async function main() {
  // ------------------------------
  // Load deposit data file
  // ------------------------------
  console.log(`\n👉 Check deposit data file`)
  const filePath = getAbsolutePath(process.env.DEPOSIT_DATA_FILE)
  if (!isFileExist(filePath)) {
    console.log(`deposit data file not found: ${filePath}`)
    return
  }
  console.log(`load file: ${filePath}`)

  const depositData = readJsonContent(filePath)
  const totalDeposit = depositData.length * config.depositETHAmount
  console.log(`validator count: ${depositData.length}`)
  if (depositData.length === 0) {
    console.log(`❌ no validator to deposit`)
    return
  }
  console.log(`require deposit: ${totalDeposit} ${config.nativeSymbol}`)
  await sleep(3 * 1000)

  // ------------------------------
  // Fund wallet
  // ------------------------------
  console.log(`\n👉 Check fund wallet balance`)
  const [signer] = await ethers.getSigners()
  console.log(`wallet address: ${signer.address}`)

  const balance = await ethers.provider.getBalance(signer.address)
  console.log(`wallet balance: ${toETH(balance)} ${config.nativeSymbol}`)
  if (balance.lt(toWei(`${totalDeposit}`))) {
    console.log(`❌ fund balance is insufficient`)
    return
  }
  await sleep(3 * 1000)

  // ------------------------------
  // Start deposit
  // ------------------------------
  console.log(`\n👉 Bulk deposit`)
  const depositContract = await contractAt('DepositContract', config.depositContractAddress, signer)
  for (let i = 0; i < depositData.length; i++) {
    console.log(`[${i + 1}/${depositData.length}] pubkey: ${depositData[i].pubkey}`)
    await sendTxn(
      depositContract.deposit(
        `0x${depositData[i].pubkey}`,
        `0x${depositData[i].withdrawal_credentials}`,
        `0x${depositData[i].signature}`,
        `0x${depositData[i].deposit_data_root}`,
        {
          value: toWei(`${config.depositETHAmount}`),
        }
      ),
      `depositContract.deposit()`
    )

    await sleep(500)
    console.log(``)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
