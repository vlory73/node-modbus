const ModbusRequestBody = require('./request-body.js')

/** Read Input Registers Request Body
 * @extends ModbusRequestBody
 */
class ReadTextRegistersRequestBody extends ModbusRequestBody {
  static fromBuffer (buffer) {
    try {
      const fc = buffer.readUInt8(0)
      const start = buffer.readUInt16BE(1)
      const count = buffer.readUInt16BE(3)

      if (fc !== 0x41) {
        return null
      }

      return new ReadTextRegistersRequestBody(start, count)
    } catch (e) {
      return null
    }
  }

  /** Create a new Read Input Registers Request Body.
   * @param {Number} start Start Address.
   * @param {Number} count Quantity of coils to be read.
   * @throws {InvalidStartAddressException} When Start address is larger than 0xFFFF.
   * @throws {InvalidQuantityException} When count is larger than 0x7D0.
   */
  constructor (start, count) {
    super(0x41)
    if (start > 0xFFFF) {
      throw new Error('InvalidStartAddress')
    }
    if (count > 0x7D0) {
      throw new Error('InvalidQuantity')
    }
    this._start = start
    this._count = count
  }

  /** Start Address. */
  get start () {
    return this._start
  }

  /** Quantity of registers */
  get count () {
    return this._count
  }

  get name () {
    return 'ReadTextRegisters'
  }

  createPayload () {
    const payload = Buffer.alloc(5)

    payload.writeUInt8(this._fc, 0) // function code
    payload.writeUInt16BE(this._start, 1) // start address
    payload.writeUInt16BE(this._count, 3) // quantitiy of coils

    return payload
  }

  get byteCount () {
    return 5
  }
}

module.exports = ReadTextRegistersRequestBody
