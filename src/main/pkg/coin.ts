import SSPLib from 'encrypted-smiley-secure-protocol';

const coinSSP = new SSPLib({
  id: 0x10,
  debug: true,
  timeout: 3000,
  fixedKey: '0123456701234567',
});
export const bootCoin = async () => {
  // opens port where Smart hopper/scs is connected
  if (coinSSP.port) {
    coinSSP.removeAllListeners();
    coinSSP.close();
    coinSSP.open('/dev/ttyUSB0');
  } else coinSSP.open('/dev/ttyUSB0');
  await coinSSP.command('SYNC');
  await coinSSP.command('SET_CHANNEL_INHIBITS', {
    channels: [1, 1, 1, 1, 1, 1, 1, 1], // channel  enable
  });
  await coinSSP.command('HOST_PROTOCOL_VERSION', { version: 6 });
  await coinSSP.command('SET_COIN_MECH_GLOBAL_INHIBIT', { enable: true });
  await coinSSP.initEncryption();
  await coinSSP.command('GET_SERIAL_NUMBER');
  await coinSSP.enable();
};
export const something = () => {
  console.log('Good');
};
