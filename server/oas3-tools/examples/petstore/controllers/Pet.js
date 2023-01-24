'use strict';

var utils = require('../utils/writer.js');
var Pet = require('../services/PetService');

module.exports.addPet = function addPet (req, res, next, body) {
    Pet.addPet(body)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.findPetsByStatus = function findPetsByStatus (req, res, next, status, sessionid) {

    Pet.findPetsByStatus(status,sessionid)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.getPetById = function getPetById (req, res, next, petId) {
    Pet.getPetById(petId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

