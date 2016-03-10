using System;
using UnityEngine;
using SimpleJson;
using System.Collections;
using UnityEngine.SceneManagement;

public class MainScript : MonoBehaviour {
	
	private bool _hasSelectRoom = false;

	public GameObject _mainAvatarObject = null;

	// Use this for initialization
	void Start () {
		UILabel[] _lables = _mainAvatarObject.GetComponentsInChildren<UILabel> ();
		_lables [0].text = "1000";
		_lables[1].text = "2000";
	}
	
	// Update is called once per frame
	void Update () {
		if (_hasSelectRoom == true) {
			SceneManager.LoadScene ("TeamScene");
		}
	}

	public void OnClickA () {
		JsonObject _jsonObject = new JsonObject ();
		_jsonObject.Add ("teamType", GameMessage.TeamEnum.A);

		Network.post ("connector.gameHandler.joinTeam", _jsonObject, (data)=>{
			if (Convert.ToInt32(data["code"]) == 200) _hasSelectRoom = true;
			Debug.Log("==========>>>2001:\t"+data);
		});
	}
}
