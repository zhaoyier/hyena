module.exports = {
	GameState: {
		None: 0,
		Wait: 1,
		Start: 2,
		Process: 3,
		Clear: 4
	}, UserState: {
		None: 0,
		Observer: 1,		//旁观者
		Ready: 2,			//准备
		Progress: 3,		//游戏中
		Abandon: 4,			//放弃
		Offline: 5,			//离线状态
		Leave: 6			//离开游戏
	}, CardType: {
		None: 0,
		DANPAI: 1, 
		DUIZI: 2, 
		SHUNZI: 3, 
		JINHUA: 4, 
		SHUNJIN: 5, 
		ZHADAN: 6
	},CardState: {
		None: 0,
		//Bet: 1,
		//Raise: 2,
		Fold: 3,
		Check: 4,
		Abandon: 5,
		Leave: 6,
		//Compare: 6
	},TeamType: {
		None: 0,
		Gold: 1,
		Diamod: 2
	},FriendType: {
		Apply: 1,
		Inspire: 2,
		Delete: 3
	}//以上有使用
};