using System;
using UnityEngine;
using SimpleJson;
using System.Collections;
using Pomelo.DotNetClient;
using UnityEngine.SceneManagement;

public class main : MonoBehaviour {
	private bool _hasSelectRoom = false;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		if (_hasSelectRoom == true) {
			_hasSelectRoom = false;
			Debug.Log("==========>>>2000:\t");
			SceneManager.LoadScene ("room");
		}
	}

	public void OnClickA() {
		JsonObject _object = new JsonObject();
		_object.Add ("teamType", 1);

		Network.post ("game.gameHandler.joinTeam", _object, (data)=>{
			if (Convert.ToInt32(data["code"]) == 200) _hasSelectRoom = true;
			Debug.Log("==========>>>2001:\t"+data);
		});
	}

	public void OnClickB() {
		JsonObject _object = new JsonObject();
		_object.Add ("teamType", 2);

		Network.post ("game.gameHandler.joinTeam", _object, (data)=>{
			if (Convert.ToInt32(data["code"]) == 200) _hasSelectRoom = true;
			Debug.Log("==========>>>2002:\t"+data);
		});
	} 
}
