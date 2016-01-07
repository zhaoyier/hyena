var utils = require('../util/utils');

var ChatService = function(app) {
	this.app = app;
	this.uidMap = {};
	this.nameMap = {};
	this.channelMap = {};
};

module.exports = ChatService;

/**
 * Add player into the channel
 *
 * @param {String} uid         user id
 * @param {String} playerName  player's role name
 * @param {String} channelName channel name
 * @return {Number} see code.js
 */
ChatService.prototype.add = function(uid, playerName, channelName) {

}

/**
 * User leaves the channel
 *
 * @param  {String} uid         user id
 * @param  {String} channelName channel name
 */
ChatService.prototype.leave = function(uid, channelName) {

}

/**
 * Kick user from chat service.
 * This operation would remove the user from all channels and
 * clear all the records of the user.
 *
 * @param  {String} uid user id
 */
ChatService.prototype.kick = function(uid) {

}

/**
 * Push message by the specified channel
 *
 * @param  {String}   channelName channel name
 * @param  {Object}   msg         message json object
 * @param  {Function} cb          callback function
 */
ChatService.prototype.pushByChannel = function(channelName, msg, cb) {

}

/**
 * Push message to the specified player
 *
 * @param  {String}   playerName player's role name
 * @param  {Object}   msg        message json object
 * @param  {Function} cb         callback
 */
ChatService.prototype.pushByPlayerName = function(playerName, msg, cb) {

}

/**
 * Cehck whether the user has already in the channel
 */
var checkDuplicate = function(service, uid, channelName) {

}

/**
 * Add records for the specified user
 */
var addRecord = function(service, uid, name, sid, channelName) {

}

/**
 * Remove records for the specified user and channel pair
 */
var removeRecord = function(service, uid, channelName) {
};

/**
 * Clear all records of the user
 */
var clearRecords = function(service, uid) {
};

/**
 * Get the connector server id assosiated with the uid
 */
var getSidByUid = function(uid, app) {
};