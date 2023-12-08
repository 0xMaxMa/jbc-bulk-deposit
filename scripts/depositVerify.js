const { contractAt, trySendTxn, getAbsolutePath, isFileExist, readJsonContent, toWei, sleep, impersonateAddress } = require('./lib/helper')
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
  // Impersonate fund wallet
  // ------------------------------
  const signer = await impersonateAddress(config.impersonateAddress)

  // ------------------------------
  // Try deposit
  // ------------------------------
  console.log(`\n👉 Verify deposit`)
  const depositContract = await contractAt('DepositContract', config.depositContractAddress, signer)
  for (let i = 0; i < depositData.length; i++) {
    console.log(`[${i + 1}/${depositData.length}] pubkey: ${depositData[i].pubkey}`)
    await trySendTxn(
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
