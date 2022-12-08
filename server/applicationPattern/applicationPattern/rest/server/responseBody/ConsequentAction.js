/**
 * @file This class provides a stub for the consequent action list  
 **/

'use strict';

class ConsequentAction {

  static label;
  static consequentOperationReference;
  static displayInNewBrowserWindow;
  static inputValueList;

  /**
   * @constructor 
   * @param {String} label label of the consequent action.
   * @param {String} request url that needs to be addressed to perform the consequent action.
   **/
  constructor(label, request, displayInNewBrowserWindow) {
    this.label = label;
    this.consequentOperationReference = consequentOperationReference;
    this.displayInNewBrowserWindow = displayInNewBrowserWindow;
    this.inputValueList= inputValueList;
  }

}

module.exports = ConsequentAction;
