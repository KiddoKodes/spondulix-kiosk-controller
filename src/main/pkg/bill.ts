import { ipcRenderer } from 'electron';
import SSPLib, { GetAllLevels } from 'encrypted-smiley-secure-protocol';

const billSSP = new SSPLib({
    id: 0x00,
    debug: true,
    timeout: 5000,
  fixedKey: '0123456701234567',
  encryptAllCommand: true,
});

export const bootBill = async () => {
  // opens port where Smart hopper/scs is connected
  if (billSSP.port) {
    billSSP.removeAllListeners();
    billSSP.close();
    billSSP.open('/dev/serial/by-path/platform-fd500000.pcie-pci-0000:01:00.0-usb-0:1.1:1.0-port0');
  } else billSSP.open('/dev/serial/by-path/platform-fd500000.pcie-pci-0000:01:00.0-usb-0:1.1:1.0-port0');
  await billSSP.command('SYNC');
  await billSSP.command('SET_CHANNEL_INHIBITS', {
    channels: [1, 1, 1, 1, 1, 1, 1, 1], // channel  enable
  });
  await billSSP.command('HOST_PROTOCOL_VERSION', { version: 6 });
  await billSSP.initEncryption();
  billSSP.enable().then(async (result) => {
    return [await billSSP.command('SETUP_REQUEST'), result]
}).then(async ([setup, result]) => {
    if (result.status == 'OK') {
        for (let i = 0; i < setup?.info?.expanded_channel_value?.length; i++) {
            //     console.log(denomination * 100)
            await billSSP.command('SET_DENOMINATION_ROUTE', {
                value: setup?.info?.expanded_channel_value[i] * 100,
                route: 'payout',
                country_code: setup?.info?.country_code

            })
        }
        return result
    }
}).then(result => {
    billSSP.command('ENABLE_PAYOUT_DEVICE', {
        REQUIRE_FULL_STARTUP: true,
        OPTIMISE_FOR_PAYIN_SPEED: true,
    })



})

};
export const stopBill = () => {
  billSSP.removeAllListeners();
  billSSP.close();
};
export const fetchBillBalance = async () => {
  const result = await billSSP.command<GetAllLevels>('GET_ALL_LEVELS');

  // if successfully fetched balance
  if (result.status === 'OK') {
    let balance = 0;

    // Maps all denominations
    Object.keys(result?.info?.counter).forEach((key: string, i: number) => {
      // update balance by denomination * number of bills(denomination_level)
      balance +=
        result.info.counter[i].denomination_level *
        result.info.counter[i].value;
    });
    // convert cents back to major currency
    result.info.total = balance / 100;
    // set new balance as currentBalance
    return result;
    // response.status(200).json({ message: result })
  }
};
billSSP.on('CREDIT_NOTE', async () => {
    console.log("Hello")
  ipcRenderer.send('bill-balance', await fetchBillBalance());
});
