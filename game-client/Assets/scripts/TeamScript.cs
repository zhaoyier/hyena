using UnityEngine;
using System.Collections;
using Pomelo.DotNetClient;

public class TeamScript : MonoBehaviour {
	private GameObject _playerBase = null;
	private PomeloClient _pclient = Network._gameClient;
	// Use this for initialization
	void Start () {
		createNewPlayerByPosition ();
	}
	
	// Update is called once per frame
	void Update () {
		
	}

	void Awake () {
		_playerBase = Resources.Load ("PlayerBase", typeof(GameObject)) as GameObject;
	}

	private void createNewPlayerByPosition() {
		GameObject _childObject = NGUITools.AddChild (this.gameObject, _playerBase);

		_childObject.name = "NewPrefab";
		_childObject.transform.localPosition = new Vector3 (1.0f, 1.0f, 1.0f);
	}
}
