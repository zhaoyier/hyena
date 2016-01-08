using System;
using SimpleJson;
using UnityEngine;
using System.Collections;
using Pomelo.DotNetClient;
using System.Collections.Generic;

using UnityEngine.SceneManagement;

public class LoginService : MonoBehaviour {
	private static PomeloClient _pclient = null;

	// Use this for initialization
	void Start () {
		Connect.getConnectHandle ((client) => {
			if (client != null) {
				_pclient = client;
			} else {
				Console.WriteLine("Error login.....");
			}
		});
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
