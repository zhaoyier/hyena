var Card = require('./card');
var pomelo = require('pomelo');
var consts = require('../../consts/consts');

//每个人: 设备类型
var MAX_MEMBER_NUM = 3;

function Team(teamId){
	this.teamId = teamId;
	this.teamType = consts.Team.A;
	this.userNum = 0;
	this.cardService = new Card();
	this.userDataArray = new Array();
	this.channel = null;

	var _this = this;
	var init = function() {
		_this.teamId = teamId;
		for (var i=0; i<MAX_MEMBER_NUM; ++i) {
			_this.userDataArray.push({
				userId: consts.Team.PLAYER_ID_NONE,
				userCard: new Array(),
				cardType: consts.Card.NONE,
			})
		}
	}

	init();
}
/* *
* args: {cardType, userId}
* retsult: {userId, playerCard, cardType}
* */
Team.prototype.addPlayer = function(data) {
	//检查是否已满
	console.log('=====>>3001:\t', data);
	if (!this.isTeamHasPosition()) return 1;
	//初始化卡牌数据
	var _userCard = this.cardService.initCard(data.cardType);
	//加入队伍
	this.userDataArray.push({
		userId: data.userId, 
		//playerCard: _playerCard, 
		cardType: data.cardType
	});

	return;
}

Team.prototype.initPlayerCard = function() {
	
}

Team.prototype.createChannel = function() {

}

Team.prototype.addPlayer2Channel = function(data) {

}

Team.prototype.removePlayerFromChannel = function(data) {

}



Team.prototype.getPlayerNum = function() {
	return this.userNum;
}

Team.prototype.isTeamHasPosition = function() {
	return this.getPlayerNum() < MAX_MEMBER_NUM;
}

Team.prototype.isTeamHasMember = function() {

}

Team.prototype.isPlayerInTeam = function(userId) {

}

Team.prototype.isPlayerInTeam = function(userId) {

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