using System;
using GameMessage;
using UnityEngine;
using SimpleJson;
using System.Collections;
using Pomelo.DotNetClient;
using UnityEngine.SceneManagement;

public class LoginScript : MonoBehaviour {

	private bool _hasLoginSuccess = false;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		if (_hasLoginSuccess == true) {
			SceneManager.LoadScene ("MainScene");
		}
	}

	public void OnLoginClick(UIInput username, UIInput password){
		JsonObject _jsonObject = new JsonObject();
		_jsonObject.Add ("username", username.label.text);
		_jsonObject.Add ("password", password.label.text);

		Network.post ("connector.entryHandler.login", _jsonObject, (data) => {
			if (Convert.ToInt32 (data ["code"]) == 200) {
				_hasLoginSuccess = true;				
			} else {
				
			}
		});
	}
}
