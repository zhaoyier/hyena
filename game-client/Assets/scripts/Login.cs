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
		_object.Add ("username", "zhaoyier");
		_object.Add ("rid", 1);
		Network.post ("connector.entryHandler.enter", _object, (data)=>{
			Debug.Log("==========>>>003:\t"+data);
		});
	}

	public void Test() {

	}
}
