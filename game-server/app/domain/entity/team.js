var Card = require('./card');
var pomelo = require('pomelo');
var consts = require('../../config/consts');

//每个人: 设备类型
var MAX_MEMBER_NUM = 3;

function Team(teamId, teamType){
	this.cardService = new Card();
	this.teamMemberArray = new Array();
	this.channel = this.createChannel(teamId);
	this.team = {teamId: teamId, teamType: teamType};
	
	// var _this = this;
	// var init = function() {
	// 	for (var i=0; i<MAX_MEMBER_NUM; ++i) {
	// 		_this.userDataArray.push({
	// 			userId: consts.Team.PLAYER_ID_NONE,
	// 			userCard: new Array(),
	// 			cardType: consts.Card.NONE,
	// 			userDevice: consts.Device.DEVICE_NONE,
	// 		})
	// 	}
	// }

	// init();
}
/* *
* args: {userId, cardType, deviceId, serverId}
* retsult: {userId, playerCard, cardType}
* */
Team.prototype.addPlayer = function(data) {
	//检查参数是否正确
	for (var i in data) {
		if (!data[i] || data[i] <= 0) {
			return false;
		}
	}

	//检查是否已满
	if (!this.isTeamHasPosition()) return false;
	//判断是否已在队伍中
	if (this.isPlayerInTeam(data.userId)) return false;
	//加入频道
	if (!this.addPlayer2Channel(data)) return false;
	
	//初始化卡牌数据
	//var _userCard = this.cardService.initCard(data.cardType);
	//加入队伍
	this.teamMemberArray.push({
		userId: data.userId, 
		userCard: new Array(), 
		cardType: 0,
		userDevice: data.deviceId,
		userServer: data.serverId
	});

	return true;
}

Team.prototype.initPlayerCard = function(data) {
	var _self = this;
	var _userCard = _self.cardService.initCard(data.cardType);

	for (var i in _self.teamMemberArray) {
		if (_self.teamMemberArray[i].userId == data.userId) continue;

		_self.teamMemberArray[i].userCard = _userCard;
		_self.teamMemberArray[i].cardType = data.cardType;
	}
}

Team.prototype.createChannel = function(teamId) {
	if (this.channel) {
		return this.channel;
	}

	var channelName = channelUtil.getTeamChannelName(teamId);
	this.channel = pomelo.app.get('channelService').getChannel(channelName, true);
	if(this.channel) {
		return this.channel;
	}
	return null;
}

Team.prototype.addPlayer2Channel = function(data) {
	if (!this.channel) {
		return false;
	}

	if (data) {
		this.channel.add(data.userId, data.serverId);
		return true;
	}

	return false;
}

Team.prototype.updateTeamInfo = function() {
	
}

Team.prototype.removePlayerFromChannel = function(data) {

}

Team.prototype.getPlayerNum = function() {
	return this.teamMemberArray.length;
}

Team.prototype.isTeamHasPosition = function() {
	return this.getPlayerNum() < MAX_MEMBER_NUM;
}

Team.prototype.isTeamHasMember = function(userId) {
	return this.getPlayerNum() > 0;
}

Team.prototype.isPlayerInTeam = function(userId) {
	var _self = this;

	for (var i in _self.teamMemberArray) {
		if (_self.teamMemberArray[i].userId != consts.Team.PLAYER_ID_NONE && _self.teamMemberArray[i].userId == userId) return true;
	}

	return false;
}

Team.prototype.updateTeamInfo = function() {

}

Team.prototype.pushLeaveMsg2All = function(userId, cb) {

}

//解散
Team.prototype.disbandTeam = function() {

}

Team.prototype.removePlayer = function(userId, cb) {

}

Team.prototype.pushChatMsg2All = function(content) {

}

Team.prototype.updateMemberInfo = function(data) {

}

///////////////////////////////////////////////////////
/**
 * Expose 'Team' constructor.
 */
module.exports = Team;