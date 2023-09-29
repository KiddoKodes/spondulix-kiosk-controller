// ssp.d.ts

declare module 'encrypted-smiley-secure-protocol' {
  interface OpenOptions {
    baudRate?: number; // The baud rate for the serial port (e.g., 9600)
    dataBits?: number; // The number of data bits (e.g., 8)
    stopBits?: number; // The number of stop bits (e.g., 1 or 2)
    parity?: 'none' | 'even' | 'odd' | 'mark' | 'space'; // Parity setting
    highWaterMark?: number; // The size of the read and write buffers
    autoOpen?: boolean; // Whether to automatically open the port (default is true)
    // Other options may be available depending on your version of the 'serialport' library.
  }
  // Define the SSPOptions interface
  interface SSPOptions {
    debug: boolean;
    id: number;
    timeout: number;
    encryptAllCommand: boolean;
    fixedKey: string;
    // Add other options here...
  }
  type SSPDeviceCommands =
    | 'RESET'
    | 'SET_CHANNEL_INHIBITS'
    | 'DISPLAY_ON'
    | 'DISPLAY_OFF'
    | 'SETUP_REQUEST'
    | 'HOST_PROTOCOL_VERSION'
    | 'POLL'
    | 'REJECT_BANKNOTE'
    | 'DISABLE'
    | 'ENABLE'
    | 'GET_SERIAL_NUMBER'
    | 'UNIT_DATA'
    | 'CHANNEL_VALUE_REQUEST'
    | 'CHANNEL_SECURITY_DATA'
    | 'CHANNEL_RE_TEACH_DATA'
    | 'SYNC'
    | 'LAST_REJECT_CODE'
    | 'HOLD'
    | 'GET_FIRMWARE_VERSION'
    | 'GET_DATASET_VERSION'
    | 'GET_ALL_LEVELS'
    | 'GET_BAR_CODE_READER_CONFIGURATION'
    | 'SET_BAR_CODE_CONFIGURATION'
    | 'GET_BAR_CODE_INHIBIT_STATUS'
    | 'SET_BAR_CODE_INHIBIT_STATUS'
    | 'GET_BAR_CODE_DATA'
    | 'SET_REFILL_MODE'
    | 'PAYOUT_AMOUNT'
    | 'SET_DENOMINATION_LEVEL'
    | 'GET_DENOMINATION_LEVEL'
    | 'COMMUNICATION_PASS_THROUGH'
    | 'HALT_PAYOUT'
    | 'SET_DENOMINATION_ROUTE'
    | 'GET_DENOMINATION_ROUTE'
    | 'FLOAT_AMOUNT'
    | 'GET_MINIMUM_PAYOUT'
    | 'EMPTY_ALL'
    | 'SET_COIN_MECH_INHIBITS'
    | 'GET_NOTE_POSITIONS'
    | 'PAYOUT_NOTE'
    | 'STACK_NOTE'
    | 'FLOAT_BY_DENOMINATION'
    | 'SET_VALUE_REPORTING_TYPE'
    | 'PAYOUT_BY_DENOMINATION'
    | 'SET_COIN_MECH_GLOBAL_INHIBIT'
    | 'SET_GENERATOR'
    | 'SET_MODULUS'
    | 'REQUEST_KEY_EXCHANGE'
    | 'SET_BAUD_RATE'
    | 'GET_BUILD_REVISION'
    | 'SET_HOPPER_OPTIONS'
    | 'GET_HOPPER_OPTIONS'
    | 'SMART_EMPTY'
    | 'CASHBOX_PAYOUT_OPERATION_DATA'
    | 'CONFIGURE_BEZEL'
    | 'POLL_WITH_ACK'
    | 'EVENT_ACK'
    | 'GET_COUNTERS'
    | 'RESET_COUNTERS'
    | 'COIN_MECH_OPTIONS'
    | 'DISABLE_PAYOUT_DEVICE'
    | 'ENABLE_PAYOUT_DEVICE'
    | 'SET_FIXED_ENCRYPTION_KEY'
    | 'RESET_FIXED_ENCRYPTION_KEY';

  // Define the SSPEvent interface
  interface SSPEvent {
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    // Add other event methods here...
  }
  interface SSPCommandResult<Command> {
    success: boolean;
    status: any;
    command: any;
    info: Command;
  }
  // Define the SSPMethods interface
  interface SSPMethods {
    open(port: string, param?: OpenOptions): Promise<void>;
    close(): void;
    getSequence(): number;
    initEncryption(): Promise<void>;
    getPacket(command: SSPDeviceCommands, args: any[]): Buffer;
    getPromise(command: SSPDeviceCommands, buffer: Buffer): Promise<any>;
    exec(command: SSPDeviceCommands, args?: any[]): Promise<any>;
    newEvent(command: SSPDeviceCommands): Promise<any>;
    parsePacket(buffer: Buffer): any;
    createHostEncryptionKeys(data: Buffer): void;
    enable(): Promise<any>;
    disable(): Promise<any>;
    command<T>(
      command: SSPDeviceCommands,
      args?: any,
    ): Promise<SSPCommandResult<T>>;
    poll(status?: boolean): Promise<any>;
    // Add other class methods here...
  }

  // Implement the SSP class with the defined interfaces
  class SSP implements SSPEvent, SSPMethods {
    port: any;

    constructor(param: SSPOptions);

    on(event: string | symbol, listener: (...args: any[]) => void): this;

    open(port: string, param?: OpenOptions): Promise<void>;

    close(): void;

    getSequence(): number;

    initEncryption(): Promise<void>;

    getPacket(command: SSPDeviceCommands, args: any[]): Buffer;

    getPromise(command: SSPDeviceCommands, buffer: Buffer): Promise<any>;

    exec(command: SSPDeviceCommands, args?: any[]): Promise<any>;

    newEvent(command: SSPDeviceCommands): Promise<any>;

    parsePacket(buffer: Buffer): any;

    createHostEncryptionKeys(data: Buffer): void;

    enable(): Promise<any>;

    disable(): Promise<any>;

    command<T>(
      command: SSPDeviceCommands,
      args?: any,
    ): Promise<SSPCommandResult<T>>;

    poll(status?: boolean): Promise<any>;

    removeAllListeners(): Promise<any>;
    // Add other class methods here...
  }
  export interface GetAllLevels {
    total: number;
    counter: {
      [i: number]: {
        denomination_level: number;
        value: number;
        country_code: string;
      };
    };
  }

  export default SSP;
}
