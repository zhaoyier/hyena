using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GameData {
	public static int userId = 0;
	public static int userGold = 0;
	public static int userDiamond = 0;

	public static string username = "";
	public static string userAvata = "";

	public static Dictionary<int, GameMessage.UserBasic> teamBasicDic;
}
