using System;
using GameMessage;
using UnityEngine;
using SimpleJson;
using System.Collections;
using Pomelo.DotNetClient;
using UnityEngine.SceneManagement;

public class LoginScript : MonoBehaviour {

	private bool _hasLoginSuccess = false;
	private GameObject _loginObject = null;
	// Use this for initialization
	void Start () {
		UIPanel[] _panels = this.gameObject.GetComponentsInChildren<UIPanel> ();
		Debug.Log("============>>>001:\t"+_panels.Length+"//"+_panels[0].name+"//"+_panels[1].name);
		_panels [1].gameObject.SetActive (true);
		_panels [2].gameObject.SetActive (false);

		//test ();
	}
	
	// Update is called once per frame
	void Update () {
		//Debug.Log ("=========>>update:\t"+_hasLoginSuccess);
		if (_hasLoginSuccess == true) {
			SceneManager.LoadScene ("MainScene");
		}
	}

	void Awake () {
		//_loginObject = Resources.Load ("LoginPanel", typeof(GameObject)) as GameObject;
	}

	void test(){
		GameObject _childObject = NGUITools.AddChild (this.gameObject, _loginObject);

		_childObject.name = "LoginPanel";
		_childObject.transform.localPosition = new Vector3 (0.0f, 1.0f, 1.0f);
	}

	public void OnLoginClick(UIInput username, UIInput password){
		JsonObject _jsonObject = new JsonObject();
		_jsonObject.Add ("username", username.label.text);
		_jsonObject.Add ("password", password.label.text);

		Network.post ("connector.entryHandler.login", _jsonObject, (data) => {
			if (Convert.ToInt32 (data ["code"]) == 200) {
				Debug.Log("=====>>Login1:\t"+data.ToString()+"//"+_hasLoginSuccess);
				GameData.username = username.label.text;
				JsonObject _rtnObject = (JsonObject)data["rtn"];
				//object _test = data["rtn"];
				GameData.userId = Convert.ToInt32(_rtnObject["userId"]);
				//GameData.userGold = Convert.ToInt32(data["rtn"]["gold"]);
				//GameData.userDiamond = Convert.ToInt32(data["rtn"]["diamond"]);
				//GameData.userAvata = data["avatar"].ToString();
				_hasLoginSuccess = true;	
				Debug.Log("=====>>Login2:\t"+data.ToString()+"//"+_hasLoginSuccess+"//"+((JsonObject)data["rtn"])["userId"]);
			} else {
				
			}
		});
	}

	public void OnRegistClick(UIInput username, UIInput password, UIInput repassword) {
		JsonObject _jsonObject = new JsonObject();
		_jsonObject.Add ("username", username.label.text);
		_jsonObject.Add ("password", password.label.text);
		_jsonObject.Add ("repassword", repassword.label.text);

		Network.post ("connector.entryHandler.register", _jsonObject, (data) => {
			Debug.Log("=====>>register:\t"+data.ToString());
			if (Convert.ToInt32 (data ["code"]) == 200) {
				_hasLoginSuccess = true;
			} else {
				
			}
		});
	}
}
