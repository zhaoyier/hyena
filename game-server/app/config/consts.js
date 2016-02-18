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
	},//以上有使用

	Team: {
		PLAYER_ID_NONE: 0,
		A: 1,
		B: 2,
		MAX_PLAYER_NUM: 5,
	},
	Device: {
		DEVICE_NONE: 0,
		IOS: 1,
		Android: 2,
		WP: 3,
	},
		
	Game: {
		None: 0,
		Bet: 1,
		Raise: 2,
		Fold: 3,
		Abandon: 4,
		Check: 5,
		Compare: 6
	},
	ServerStatus: {
		OK: 200,
		COMMON_ERROR: 201,
		RESET_ERROR: 202,
	}
};