import { ipcRenderer } from 'electron';
import SSPLib, { GetAllLevels } from 'encrypted-smiley-secure-protocol';

const coinSSP = new SSPLib({
  id: 0x10,
  debug: true,
  timeout: 3000,
  fixedKey: '0123456701234567',
  encryptAllCommand: true,
});

export const bootCoin = async () => {
  // opens port where Smart hopper/scs is connected
  if (coinSSP.port) {
    coinSSP.removeAllListeners();
    coinSSP.close();
    coinSSP.open('/dev/ttyCoin');
  } else coinSSP.open('/dev/ttyCoin');
  await coinSSP.command('SYNC');
  await coinSSP.command('SET_CHANNEL_INHIBITS', {
    channels: [1, 1, 1, 1, 1, 1, 1, 1], // channel  enable
  });
  await coinSSP.command('HOST_PROTOCOL_VERSION', { version: 6 });
  await coinSSP.command('SET_COIN_MECH_GLOBAL_INHIBIT', { enable: true });
  await coinSSP.initEncryption();
  await coinSSP.command('GET_SERIAL_NUMBER');
   coinSSP.enable();
};
export const stopCoin = () => {
  coinSSP.removeAllListeners();
  coinSSP.close();
};
export const fetchCoinBalance = async () => {
  const result = await coinSSP.command<GetAllLevels>('GET_ALL_LEVELS');

  // if successfully fetched balance
  if (result.status === 'OK') {
    let balance = 0;

    // Maps all denominations
    Object.keys(result?.info?.counter).forEach((key: string, i: number) => {
      // update balance by denomination * number of coins(denomination_level)
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
coinSSP.on('COIN_CREDIT', async () => {
  ipcRenderer.send('coin-balance', await fetchCoinBalance());
});
