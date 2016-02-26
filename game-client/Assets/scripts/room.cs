using System;
using UnityEngine;
using SimpleJson;
using System.Collections;
using Pomelo.DotNetClient;
using UnityEngine.SceneManagement;

public class room : MonoBehaviour {
	private GameObject _playerBase = null;
	private PomeloClient _pclient = Network._gameClient;

	// Use this for initialization
	void Start () {
		creatNewPlayerByPosition ();
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	void Awake(){
		_playerBase = Resources.Load ("PlayerBase", typeof(GameObject)) as GameObject;
		Debug.Log ("====>>>:\t"+_playerBase);
	}

	private void creatNewPlayerByPosition() {
		//GameObject _parentObject = GameObject.FindGameObjectWithTag ("RoomPanel");
		GameObject _childObject = NGUITools.AddChild (this.gameObject, _playerBase);

		_childObject.name = "NewPrefab";
		_childObject.transform.localPosition = new Vector3 (1.0f, 1.0f, 1.0f);
	}
}
