/* *
* function: 提供基础接口
* */
var async = require('async');
var Card = require('./Card');
var pomelo = require('pomelo');

var consts = require('../../config/consts');
var channelUtil = require('../../util/channelUtil');

//每个人: 设备类型
var MAX_MEMBER_NUM = 3;

function Team(teamId, teamType) {
	this.cardService = new Card();
	this.teamMemberArray = new Array();
	this.teamBasic = {
		state: consts.GameState.None, //状态
		timestamp: 0, 	//todo: 
		teamId: teamId, 
		teamType: teamType, 
		betType: 0,
		bet: 0
	};	//记录游戏状态
	this.channel = this.createChannel(teamId);
	//this.teamBa = {teamId: teamId, teamType: teamType};
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
	//计算位置
	var _placeId = this.getNewPlace();
	//加入队伍
	this.teamMemberArray.push({
		userId: data.userId,
		//userBasic: {name: 'admin', gold: 99, diamond: 99, avatar: '001', state: consts.UserState.None, lastHeart: Date.now(), server: data.serverId, device: data.device},	//todo
		//userBasic: {state: consts.UserState.None, activeTime: Date.now()/1000|0, gold: 100, diamond: 100, bet: 0},
		userBasic: {
			placeId: _placeId,					//座位号
			username: data.basic.username, 		//
			avatar: data.basic.avatar, 			//头像
			state: consts.UserState.None, 		//游戏状态
			activeTime: Date.now()/1000|0, 		//状态更新时间
			gold: data.basic.gold,				//
			diamond: data.basic.diamond,		//
			weight: 0, 							//权重
			bet: 0 								//
		},
		//userBasic: initUserBasic(),
		userCard: {userCard: new Array(), cardType: 0, cardState: consts.CardState.None/*出牌状态*/},
	});

	return true;

	//todo: 同步队友
	// this.pushUserMsg2All(function(error, doc) {
	// 	return true;
	// });
}

Team.prototype.getTeamMemberList = function() {
	return this.teamMemberArray;
}

Team.prototype.getTeamBasicInfo = function() {
	return this.teamBasic;
}

Team.prototype.getTeamMemberBasic = function() {
	var _temp = [];
	for (var i in this.teamMemberArray) {
		var _elem = this.teamMemberArray[i];
		_temp.push({username: _elem.userBasic.username, state: _elem.state, bet: _elem.bet});
	}

	return _temp;
}

Team.prototype.getProcessTeamMember = function() {
	var _activeMember = [];
	for (var i in this.teamMemberArray) {
		if (this.teamMemberArray[i].userBasic.state == consts.UserState.Progress) _activeMember.push(this.teamMemberArray[i]);
	}

	return _activeMember;
}

Team.prototype.initUserCard = function(userWeight) {
	var _cardType = 1;//userWeight;	//todo: 转换为卡牌类型
	var _userCard = this.cardService.initCard(_cardType);
	return {userCard: _userCard, cardType: _cardType, cardState: consts.CardState.None};
}

Team.prototype.updateTeamMemberBasic = function(data) {
	for (var i in this.teamMemberArray) {
		//if (this.teamMemberArray[i].userId == data.userId)
	}
}

Team.prototype.getTeamUserBasic = function(data) {
	for (var i in this.teamMemberArray) {
		if (this.teamMemberArray[i].userId == data.userId) return this.teamMemberArray[i];
	}

	return null;
}

Team.prototype.getNewPlace = function() {
	var _placeNumber = 0;

	while (_placeNumber <= MAX_MEMBER_NUM) {
		var _hasFind = false, ++_placeNumber;
		for (var i in this.teamMemberArray) {
			if (this.teamMemberArray[i].userBasic.placeId == _placeNumber) _hasFind = true;
		}

		if (_hasFind == false) return _placeNumber;
	}
}

Team.prototype.getNextPlayer = function() {

}

Team.prototype.getCompareUserCard = function(home, away) {
	var _homeBasic = this.getTeamUserBasic(home.userId);
	if (_homeBasic == null) return null;
	var _awayBasic = this.getTeamUserBasic(away.userId);
	if (_awayBasic == null) return null;

	return this.cardService.compareUserCard(_homeBasic.userCard, _awayBasic.userCard);
}

// Team.prototype.updateTeamMemberBet = function() {
// 	if (this.teamBasic.teamType == consts.TeamType.Gold) {

// 	} else if (this.teamBasic.teamType == consts.TeamType.Diamond) {

// 	} else {

// 	}
// }

//通知开始
Team.prototype.pushStartMsg2All = function(data, callfunc) {
	//todo: 判断和修改游戏状态
	if (this.teamBasic.state == consts.GameState.None) {
		this.teamBasic.state = consts.GameState.Start;
		this.teamBasic.timestamp = Date.now()/1000|0;

		this.channel.pushMessage('onStartTeam', {}, callfunc);
	} else {
		return callfunc('team state error start');
	}
}

Team.prototype.pushBetMsg2All = function(data, callfunc) {
	//todo: 修改状态，通知
	if (this.teamBasic.state == consts.GameState.Start 
		|| this.teamBasic.state == consts.GameState.Process) {
		this.teamBasic.state = consts.GameState.Process;
		this.teamBasic.timestamp = Date.now()/1000|0;

		this.channel.pushMessage('onBetTeam', {}, callfunc);
	} else {
		return callfunc('team state error bet');
	}
}

Team.prototype.pushRaiseMsg2All = function(data, callfunc) {
	//todo: 修改状态，通知
	if (this.teamBasic.state == consts.GameState.Start 
		|| this.teamBasic.state == consts.GameState.Process) {
		this.teamBasic.state = consts.GameState.Process;
		this.teamBasic.timestamp = Date.now()/1000|0;

		this.channel.pushMessage('onRaiseTeam', {}, callfunc);
	} else {
		return callfunc('team state error bet');
	}
}

Team.prototype.pushCheckMsg2All = function(data, callfunc) {
	//todo: 修改状态，通知
	if (this.teamBasic.state == consts.GameState.Start 
		|| this.teamBasic.state == consts.GameState.Process) {
		this.teamBasic.state = consts.GameState.Process;
		this.teamBasic.timestamp = Date.now()/1000|0;

		this.channel.pushMessage('onCheckTeam', {}, callfunc);
	} else {
		return callfunc('team state error bet');
	}
}

Team.prototype.pushAbandonMsg2All = function(data, callfunc) {
	//todo: 修改状态，通知
	if (this.teamBasic.state == consts.GameState.Start 
		|| this.teamBasic.state == consts.GameState.Process) {
		this.teamBasic.state = consts.GameState.Process;
		this.teamBasic.timestamp = Date.now()/1000|0;

		this.channel.pushMessage('onAbandonTeam', {}, callfunc);
	} else {
		return callfunc('team state error bet');
	}
}

Team.prototype.pushLeaveMsg2All = function(data, callfunc) {
	//todo: 修改状态，通知
	if (this.teamBasic.state == consts.GameState.Start 
		|| this.teamBasic.state == consts.GameState.Process) {
		this.teamBasic.state = consts.GameState.Process;
		this.teamBasic.timestamp = Date.now()/1000|0;

		this.channel.pushMessage('onLeaveTeam', {}, callfunc);
	} else {
		return callfunc('team state error bet');
	}
}

Team.prototype.pushCompareMsg2All = function(data, callfunc) {
	//todo: 修改状态，通知
	if (this.teamBasic.state == consts.GameState.Start 
		|| this.teamBasic.state == consts.GameState.Process) {
		this.teamBasic.state = consts.GameState.Process;
		this.teamBasic.timestamp = Date.now()/1000|0;

		this.channel.pushMessage('onCompareTeam', {}, callfunc);
	} else {
		return callfunc('team state error bet');
	}
}

Team.prototype.pushClearMsg2All = function(data, callfunc) {
	//todo: 修改状态，通知
	if (this.teamBasic.state == consts.GameState.Start 
		|| this.teamBasic.state == consts.GameState.Process) {
		this.teamBasic.state = consts.GameState.Process;
		this.teamBasic.timestamp = Date.now()/1000|0;

		this.channel.pushMessage('onClearTeam', {}, callfunc);
	} else {
		return callfunc('team state error bet');
	}
}

//通知聊天
Team.prototype.pushChatMsg2All = function(data, callfunc) {
	//todo: 修改状态，通知
	if (this.teamBasic.state == consts.GameState.Start 
		|| this.teamBasic.state == consts.GameState.Process) {
		this.teamBasic.state = consts.GameState.Process;
		this.teamBasic.timestamp = Date.now()/1000|0;

		this.channel.pushMessage('onChatTeam', {}, callfunc);
	} else {
		return callfunc('team state error bet');
	}
}

/************************************End********************************************/




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
// Team.prototype.updateTeamState = function(data) {
// 	this.teamState = {status: data.status, timestamp: Date.now()/1000|0};
// }

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

//新进万家, 通知基本信息
Team.prototype.pushUserMsg2All = function(callfunc) {
	var _userBasicObject = {}, _self = this;
	for (var i in _self.userDataArray) {
		_userBasicObject[_self.userDataArray[i].userId] = _self.userDataArray[i].userBasic;
	}

	if (Object.keys(_userBasicObject).length > 0) {
		_self.channel.pushMessage('onBasicTeam', _userBasicObject, callfunc);
	}
}





// Team.prototype.pushLeaveMsg2All = function(userId, callback) {
// 	var _ret = {};
// 	if (!this.channel) {
// 		return callback(null, _ret);
// 	}

// 	var _msg = {userId: userId};
// 	this.channel.pushMessage('onTeammateLeaveTeam', _msg, function(error, doc) {
// 		return callback(null, ret);
// 	})
// }


function initUserBasic(data) {
	return {};
}

function findNextPlayer(userList, currentId) {
	var _tail = userList.slice(-1);
	if (_tail.userId = currentId) {
		return userList[0];
	} else {
		for (var i in userList) {
			if (userList[i].userId) return userList[(parseInt(i)+1)];
		}
	}
	return null;
}

///////////////////////////////////////////////////////
/**
 * Expose 'Team' constructor.
 */
module.exports = Team;