/*************************************************************************************************************************************************************
 * This file contains the primary key for the list attributes in core-model 
 *************************************************************************************************************************************************************/
 'use strict';

 /*************************************************************************************************************************************************************
  * key attribute corresponds to the lists 
  *************************************************************************************************************************************************************/
 
 module.exports.keyAttributeOfList = {
     'logical-termination-point': "uuid",
     'profile': "uuid",
     'layer-protocol': "local-id",
     'release-list': "local-id",
     'response-value-list': "field-name",
     'consequent-action-list': "label",
     'forwarding-domain' : "uuid",
     'forwarding-construct': "uuid",
     'fc-port': "local-id",
     'name':"value-name"
 }