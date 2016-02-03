using System;
using UnityEngine;
using SimpleJson;
using System.Collections;

public class Login : MonoBehaviour {

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	public void OnClick(){
		JsonObject _object = new JsonObject();
		_object.Add ("username", "temp");
		_object.Add ("password", "temp");
		_object.Add ("server", 1);
		_object.Add ("rid", 1);
		Network.post ("connector.entryHandler.login", _object, (data)=>{
		//Network.post ("game.gameHandler.joinTeam", _object, (data)=>{
			Debug.Log("==========>>>003:\t"+data);
		});
	}

	public void OnTrigger(){
		JsonObject _object = new JsonObject();
		_object.Add ("username", "zhaoyier");
		_object.Add ("rid", 1);
		//Network.post ("game.gameHandler.startTeam", _object, (data)=>{
		Network.post ("game.gameHandler.joinTeam", _object, (data)=>{
			Debug.Log("==========>>>004:\t"+data);
		});
	}

	public void OnStartTeam(){
		JsonObject _object = new JsonObject();
		_object.Add ("username", "zhaoyier");
		_object.Add ("rid", 1);
		//Network.post ("game.gameHandler.startTeam", _object, (data)=>{
		Network.post ("game.gameHandler.startTeam", _object, (data)=>{
			Debug.Log("==========>>>005:\t"+data);
		});
	}

	public void OnExitGame() {
		Network._gameClient.disconnect ();
		Application.Quit ();
	}

}
