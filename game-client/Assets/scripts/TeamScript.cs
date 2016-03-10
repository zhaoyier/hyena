using UnityEngine;
using System.Collections;
using Pomelo.DotNetClient;

public class TeamScript : MonoBehaviour {
	private int _myPosition = 0;
	private GameObject _playerBase = null;
	private PomeloClient _pclient = Network._gameClient;
	// Use this for initialization
	void Start () {
		//for (int i = 0; i < 10; ++i) {
			Vector3 v = getCodeRandomCoordinate ();
			Debug.Log ("======>>\t" + v.ToString ());
			//OnMoveSprite (v);
		//}

		//createNewPlayerByPosition ();
		//test();
		/*_pclient.on ("onJoinTeam", (data) => {
			OnJoinTeam();
		});
		_pclient.on ("onPrepareTeam", (data) => {
			OnPrepareTeam();
		});
		_pclient.on ("onStartTeam", (data) => {
			OnStartTeam();
		});
		_pclient.on ("onBetTeam", (data) => {
			OnBetTeam();
		});
		_pclient.on ("onCheckTeam", (data) => {
			OnCheckTeam();
		});
		_pclient.on ("onAbandonTeam", (data) => {
			OnAbandonTeam();
		});
		_pclient.on ("onLeaveTeam", (data) => {
			OnLeaveTeam();
		});
		_pclient.on ("onCompareTeam", (data) => {
			OnCompareTeam();
		});
		_pclient.on ("onChatTeam", (data) => {
			OnChatTeam();
		});*/
	}
	
	// Update is called once per frame
	void Update () {
		
	}

	void Awake () {
		_playerBase = Resources.Load ("PlayerBase", typeof(GameObject)) as GameObject;
	}

	private void OnMoveSprite(Vector3 coord) {
		iTween.MoveBy(gameObject, iTween.Hash("amount", coord, "easeType", "easeInOutExpo", "loopType", "pingPong", "delay", .1, "speed", 3.0f));
	}

	private void createNewPlayerByPosition() {
		GameObject _childObject = NGUITools.AddChild (this.gameObject, _playerBase);

		_childObject.name = "NewPrefab";
		_childObject.transform.localPosition = new Vector3 (0.0f, 1.0f, 1.0f);
	}

	private void test(){
		for (int i = 0; i < 5; ++i) {
			if (i == 0) {
				show ("top_left", -240.0f, 60.0f);
			} else if (i== 1) {
				show ("lower_left", -190.0f, -70.0f);
			} else if (i== 2) {
				show ("central_left", -0.0f, -120.0f);
			} else if (i== 3) {
				show ("lower_right", 190.0f, -70.0f);
			} else if (i== 4) {
				show ("top_right", 240.0f, 60.0f);
			}
		}
	}

	private void show(string name, float x, float y) {
		GameObject _childObject = NGUITools.AddChild (this.gameObject, _playerBase);

		_childObject.name = "NewPrefab_"+name;
		_childObject.transform.localPosition = new Vector3 (x, y, 1.0f);

		UILabel[] _uILable = _childObject.GetComponentsInChildren<UILabel> ();
		_uILable [0].text = name;
		_uILable [1].text = (x * y).ToString();
	}

	private void OnJoinTeam() {
		
	}

	private void OnPrepareTeam() {

	}

	private void OnStartTeam() {

	}

	private void OnBetTeam() {

	}

	private void OnCheckTeam() {

	}

	private void OnAbandonTeam() {

	}

	private void OnLeaveTeam() {

	}

	private void OnCompareTeam() {

	}

	private void OnChatTeam() {

	}

	private void OnShowPlayer(GameMessage.UserBasic userBasic) {
		GameObject _childObject = NGUITools.AddChild (this.gameObject, _playerBase);

		Vector3 _userCoordinate = getPlayerCoordinate(getPlayerPosition (1, 1));

		_childObject.name = userBasic.username+"Object";
		_childObject.transform.localPosition = _userCoordinate;

		UILabel[] _uILable = _childObject.GetComponentsInChildren<UILabel> ();
		_uILable [0].text = name;
		//_uILable [1].text = (x * y).ToString();
	}

	private GameMessage.PositionEnum getPlayerPosition(int selfPosition, int otherPosition) {
		if (selfPosition == 1) {
			if (otherPosition == 2) {
				return GameMessage.PositionEnum.LOWER_RIGHT;
			} else if (otherPosition == 3) {
				return GameMessage.PositionEnum.TOP_RIGHT;
			} else if (otherPosition == 4) {
				return GameMessage.PositionEnum.TOP_LEFT;
			} else if (otherPosition == 5) {
				return GameMessage.PositionEnum.LOWER_LEFT;
			} else {
				return GameMessage.PositionEnum.CENTRAL;
			}
		} else if (selfPosition == 2) {
			if (otherPosition == 1) {
				return GameMessage.PositionEnum.LOWER_LEFT;
			} else if (otherPosition == 3) {
				return GameMessage.PositionEnum.LOWER_RIGHT;
			} else if (otherPosition == 4) {
				return GameMessage.PositionEnum.TOP_RIGHT;
			} else if (otherPosition == 5) {
				return GameMessage.PositionEnum.TOP_LEFT;
			} else {
				return GameMessage.PositionEnum.CENTRAL;
			}
		} else if (selfPosition == 3) {
			if (otherPosition == 1) {
				return GameMessage.PositionEnum.TOP_LEFT;
			} else if (otherPosition == 2) {
				return GameMessage.PositionEnum.LOWER_LEFT;
			} else if (otherPosition == 4) {
				return GameMessage.PositionEnum.LOWER_RIGHT;
			} else if (otherPosition == 5) {
				return GameMessage.PositionEnum.TOP_RIGHT;
			} else {
				return GameMessage.PositionEnum.CENTRAL;
			}
		} else if (selfPosition == 4) {
			if (otherPosition == 1) {
				return GameMessage.PositionEnum.TOP_RIGHT;
			} else if (otherPosition == 2) {
				return GameMessage.PositionEnum.TOP_LEFT;
			} else if (otherPosition == 3) {
				return GameMessage.PositionEnum.LOWER_LEFT;
			} else if (otherPosition == 5) {
				return GameMessage.PositionEnum.LOWER_RIGHT;
			} else {
				return GameMessage.PositionEnum.CENTRAL;
			}
		} else if (selfPosition == 5) {
			if (otherPosition == 1) {
				return GameMessage.PositionEnum.LOWER_RIGHT;
			} else if (otherPosition == 2) {
				return GameMessage.PositionEnum.TOP_RIGHT;
			} else if (otherPosition == 3) {
				return GameMessage.PositionEnum.TOP_LEFT;
			} else if (otherPosition == 4) {
				return GameMessage.PositionEnum.LOWER_LEFT;
			} else {
				return GameMessage.PositionEnum.CENTRAL;
			}
		} else {
			return GameMessage.PositionEnum.CENTRAL;
		}
	}

	private Vector3 getCardOriginCoordinate() {
		return new Vector3 (0.0f, 80.0f, 0.0f);
	}

	private Vector3 getCardCoordinate(GameMessage.PositionEnum position) {
		if (position == GameMessage.PositionEnum.TOP_LEFT) {
			return new Vector3 (0.0f, 0.0f, 0.0f);
		} else if (position == GameMessage.PositionEnum.LOWER_LEFT) {
			return new Vector3 (0.0f, 0.0f, 0.0f);
		} else if (position == GameMessage.PositionEnum.CENTRAL) {
			return new Vector3 (0.0f, 0.0f, 0.0f);
		} else if (position == GameMessage.PositionEnum.LOWER_RIGHT) {
			return new Vector3 (0.0f, 0.0f, 0.0f);
		} else if (position == GameMessage.PositionEnum.TOP_RIGHT) {
			return new Vector3 (0.0f, 0.0f, 0.0f);
		} else {
			return new Vector3 (0.0f, 0.0f, 0.0f);
		}
	}

	private Vector3 getPlayerCoordinate(GameMessage.PositionEnum position) {
		if (position == GameMessage.PositionEnum.TOP_LEFT) {
			return new Vector3 (-240.0f, 60.0f, 1.0f);
		} else if (position == GameMessage.PositionEnum.LOWER_LEFT) {
			return new Vector3 (-190.0f, -70.0f, 1.0f);
		} else if (position == GameMessage.PositionEnum.CENTRAL) {
			return new Vector3 (0.0f, -120.0f, 1.0f);
		} else if (position == GameMessage.PositionEnum.LOWER_RIGHT) {
			return new Vector3 (190.0f, -70.0f, 1.0f);
		} else if (position == GameMessage.PositionEnum.TOP_RIGHT) {
			return new Vector3 (240.0f, 60.0f, 1.0f);
		} else {
			return new Vector3 (1.0f, 1.0f, 1.0f);
		}
	}

	private Vector3 getCodeRandomCoordinate() {
		System.Random random = new System.Random();
		//float coordX = (float)random.Next(-100, 100);
		//float coordY = (float)random.Next (-100, 100);
		float coordX = (float)random.NextDouble()*6;
		float coordY = (float)random.NextDouble ()*2;
		return new Vector3 (coordX, coordY, 0.0f);
	}
}
