/**
 * @file This class provides a stub for the consequent action list  
 **/

'use strict';

class ConsequentAction {

  static label;
  static request;
  static displayInNewBrowserWindow;
  static inputValueList;

  /**
   * @constructor 
   * @param {String} label label of the consequent action.
   * @param {String} request url that needs to be addressed to perform the consequent action.
   **/
  constructor(label, request, displayInNewBrowserWindow, inputValueList) {
    this.label = label;
    this.request = request;
    this.displayInNewBrowserWindow = displayInNewBrowserWindow;
    this.inputValueList = inputValueList;
  }

}

module.exports = ConsequentAction;