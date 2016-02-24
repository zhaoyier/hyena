using System;
using UnityEngine;
using SimpleJson;
using System.Collections;
using Pomelo.DotNetClient;
using UnityEngine.SceneManagement;

public class Login2 : MonoBehaviour {
	private bool _hasLoginSuccess = false;

	// Use this for initialization
	void Start () {
		//UIEventListener.Get (commitGo.gameObject).onClick = OnClickLogin;
	}

	// Update is called once per frame
	void Update () {
		if (_hasLoginSuccess == true) {
			_hasLoginSuccess = false;
			Debug.Log("==========>>>0036:\t");
			SceneManager.LoadScene ("main");
		}
	}

	public void OnClickLogin(UIInput username, UIInput password) {
		Debug.Log ("=======>>001:\t" + username.label.text + "//" + password.label.text);
		JsonObject _object = new JsonObject();
		_object.Add ("username", username.label.text);
		_object.Add ("password", password.label.text);

		Network.post ("connector.entryHandler.login", _object, (data)=>{
			if (Convert.ToInt32(data["code"]) == 200) _hasLoginSuccess = true;
			Debug.Log("==========>>>003:\t"+data);
		});
	}
}
