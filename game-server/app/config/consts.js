module.exports = {
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
	CardType: {
		NONE: 0,
		DANPAI: 1, 
		DUIZI: 2, 
		SHUNZI: 3, 
		JINHUA: 4, 
		SHUNJIN: 5, 
		ZHADAN: 6	
	},
	GameStatus: {
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