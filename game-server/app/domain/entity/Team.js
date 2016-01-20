var Card = require('./card');
var pomelo = require('pomelo');
var consts = require('../../config/consts');

//每个人: 设备类型
var MAX_MEMBER_NUM = 3;

function Team(teamId, teamType){
	this.teamStatus = 0;
	this.cardService = new Card();
	this.teamMemberArray = new Array();
	this.channel = this.createChannel(teamId);
	this.team = {teamId: teamId, teamType: teamType};
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
	//加入队伍
	this.teamMemberArray.push({
		userId: data.userId,
		userBasic: {name: 'admin', gold: 99, diamond: 99, avatar: '001'},	//todo
		userCard: {hand: new Array(), type: 0, status: 0/*出牌状态*/},
		userDevice: data.deviceId,
		userServer: data.serverId,
		teamStatus: {status: 0, timestamp: 0}
	});

	//todo: 同步队友
	this.updateTeamInfo();

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

/* *
* param: 
* */
Team.prototype.updateMemeberStatus = function(data) {
	var _self = this;
	for (var i in _self.teamMemberArray) {
		if (_self.teamMemberArray[i].userId == data.userId) continue;

		_self.teamMemberArray[i].userCard.status = data.cardStatus;
	}
}

/* *
* param: {status: }
* */
Team.prototype.updateTeamStatus = function(data) {
	this.teamStatus = {status: data.status, timestamp: Date.now()/1000|0};
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

Team.prototype.removePlayerFromChannel = function(data) {
	if (!this.channel) return false;

	if (data) {
		this.channel.leave(data.userId, data.serverId);
		return true;
	}
	return false;
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

//解散
Team.prototype.disbandTeam = function() {

}

Team.prototype.removePlayer = function(userId, cb) {

}

Team.prototype. = function(data, callfunc) {

}

/*
onBasicTeam: 1,
onStartTeam: 2,
onBetTeam: 3,
onRaiseTeam: 4,
onCheckTeam: 5,
onCompareTeam: 6,
onClearTeam: 7,
onLeaveTeam: 99,
*/

//新进万家, 通知基本信息
Team.prototype.pushUserMsg2All = function() {
	var _infoObjDict = {};
	var _arr = this.userDataArray;
	for (var i in _arr) {
		var _userId = _arr[i].userId;
		_infoObjDict[_userId] = _arr[i].userBasic;
	}

	if (Object.keys(_infoObjDict).length > 0) {
		this.channel.pushMessage('onBasicTeam', _infoObjDict, null);
	}
}

//通知开始
Team.prototype.pushStartMsg2All = function(data, callfunc) {

}

//通知XX
Team.prototype.pushBetMsg2All = function(data, callfunc) {

}

//通知
Team.prototype.pushRaiseMsg2All = function(data, callfunc) {

}

//通知
Team.prototype.pushCheckMsg2All = function(data, callfunc) {

}

//通知
Team.prototype.pushCompareMsg2All = function(data, callfunc) {

}

//通知
Team.prototype.pushClearMsg2All = function(data, callfunc) {

}

//通知聊天
Team.prototype.pushChatMsg2All = function(data, callfunc) {

}

Team.prototype.pushLeaveMsg2All = function(userId, callback) {
	var _ret = {};
	if (!this.channel) {
		return callback(null, _ret);
	}

	var _msg = {userId: userId};
	this.channel.pushMessage('onTeammateLeaveTeam', _msg, function(error, doc) {
		return callback(null, ret);
	})
}

Team.prototype.pushChatMsg2All = function(content) {

}


///////////////////////////////////////////////////////
/**
 * Expose 'Team' constructor.
 */
module.exports = Team;