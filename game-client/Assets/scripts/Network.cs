using System;
using UnityEngine;
using System.Collections;
using SimpleJson;
using Pomelo.DotNetClient;

public class Network {
	public static PomeloClient _gameClient = null;

	private static string _gateHost = "10.96.36.181";
	private static int _gatePort = 3014;

	//public delegate JsonObject callbackEventHandler();
	public static void post(string url, JsonObject obj, Action<JsonObject> action) {
		//getGameServerList ((data) => {
		if (_gameClient == null) {
			getGameServerHandler ((handler) => {
				_gameClient = handler;
				Debug.Log("========>>002");
				_gameClient.request(url, obj, action);
			});
		} else {
			_gameClient.request (url, obj, action);
		}
	}

	public static void getGameServerHandler(Action<PomeloClient> action) {
		getGameServerList ((list) => {
			if (Convert.ToInt32(list["code"]) == 200 ) {
				_gameClient.disconnect();
				_gameClient = new PomeloClient((string)list["host"], Convert.ToInt32(list["port"]));
				_gameClient.connect(null, (client)=>{
					action(_gameClient);
				});
			} else {
				Debug.Log("Get Game Server List Error...");
				action(null);
			}
		});
	}

	public static void getGameServerList(Action<JsonObject> action) {
		_gameClient = new PomeloClient (_gateHost, _gatePort);
		_gameClient.connect (null, (data)=>{
			JsonObject msg = new JsonObject();
			msg["uid"] = "admin";

			_gameClient.request("gate.gateHandler.queryEntry", msg, action);
		});
	}
}
