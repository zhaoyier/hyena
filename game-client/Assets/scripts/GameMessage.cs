using System;
using SimpleJson;
using System.Reflection;
using System.Collections;
using System.Runtime.Serialization;

namespace GameMessage {
	enum TeamEnum{
		A = 1,
		B = 2
	}

	enum PositionEnum {
		TOP_LEFT = 1,
		LOWER_LEFT = 2,
		CENTRAL = 3,
		LOWER_RIGHT = 4,
		TOP_RIGHT = 5
	}

	public class LoginRequest {
		public string username { set; get;}
		public string password { set; get;}
	}

	public class LoginResponse {
		public int code{ set; get;}
		public int userId { set; get;}
	}

	public class RegisterRequest {
		
	}

	public class RegisterResponse {
		
	}

	public class SelectTeamRequest {
		public int teamType { set; get;}
	}

	public class SelectTeamResponse {
		
	}

	public class UserBasic {
		public int userId { set; get;}
		public int userBalance{ set; get;}
		public int userPosition { set; get;}
		public string username { set; get;}
		public string userAvatar{ set; get;}
	}

	class Serialize {
		public static JsonObject Object2Json(object obj) {
			JsonObject jsonObject = new JsonObject ();
			PropertyInfo[] properties = obj.GetType ().GetProperties();
			foreach(PropertyInfo pi in properties) {
				object value = pi.GetValue (obj, null);
				jsonObject.Add (pi.Name, value.ToString());
			}

			return jsonObject;
		}

		public static object Json2Object<T>(JsonObject json) {
			object obj = SimpleJson.SimpleJson.DeserializeObject<T> (json.ToString ());
			return obj;
		}
	}
}
