// @ts-check
'use strict';

class TcpObject {
  address
  protocol
  port

  /**
   * @constructor
   * @param {String} protocol
   * @param {Object} address
   * @param {String} port
   */
  constructor(protocol, address, port) {
    this.address = address;
    this.protocol = protocol;
    this.port = port;
  }
}

module.exports = TcpObject;
