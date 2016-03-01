using System;
using UnityEngine;
using SimpleJson;
using System.Collections;
using UnityEngine.SceneManagement;

public class MainScript : MonoBehaviour {
	
	private bool _hasSelectRoom = false;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		if (_hasSelectRoom == true) {
			//_hasSelectRoom = false;
			Debug.Log("==========>>>2000:\t");
			SceneManager.LoadScene ("TeamScene");
		}
	}

	public void OnClickA () {
		JsonObject _jsonObject = new JsonObject ();
		_jsonObject.Add ("teamType", GameMessage.TeamEnum.A);

		Network.post ("game.gameHandler.joinTeam", _jsonObject, (data)=>{
			if (Convert.ToInt32(data["code"]) == 200) _hasSelectRoom = true;
			Debug.Log("==========>>>2001:\t"+data);
		});
	}

	public void OnClickB () {
		JsonObject _jsonObject = new JsonObject ();
		_jsonObject.Add ("teamType", GameMessage.TeamEnum.B);

		Network.post ("game.gameHandler.joinTeam", _jsonObject, (data)=>{
			if (Convert.ToInt32(data["code"]) == 200) _hasSelectRoom = true;
			Debug.Log("==========>>>2001:\t"+data);
		});
	}
}
