using System;
using SimpleJson;
using UnityEngine;
using System.Collections;
using Pomelo.DotNetClient;
using System.Collections.Generic;

using UnityEngine.SceneManagement;

public class LoginService : MonoBehaviour {
	private static PomeloClient _pclient = null;

	//public GameObject _btn = null;

	// Use this for initialization
	void Start () {
		Connect.getConnectHandle ((client) => {
			if (client != null) {
				_pclient = client;
			} else {
				Console.WriteLine("Error login.....");
			}
		});

		//_btn = this.GetComponent<Game> ();
		//UIEventListener.Get (_btn).onClick = OnClick2 ();
	}

	void Awake() {
		//GameObject button = GameObject.FindGameObjectWithTag ("test");
		GameObject button = GameObject.Find("UI Root (2D)/Camera/Anchor/Panel/Button");
		UIEventListener.Get (button).onClick = ButtonClick;
	}
	
	// Update is called once per frame
	void Update () {
		
	}

	void ButtonClick(GameObject button) {
		Debug.Log ("GameObject" + button.name);
	}

	public void OnClick(GameObject obj){
		Console.WriteLine ("111111111111111111");
	}
}
