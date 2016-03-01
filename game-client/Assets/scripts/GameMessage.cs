using System;
using SimpleJson;
using System.Reflection;
using System.Collections;
using System.Runtime.Serialization;

namespace GameMessage {
	enum TeamEnum: int{
		A = 1,
		B = 2
	}

	class LoginRequest {
		public string username { set; get;}
		public string password { set; get;}
	}

	class LoginResponse {
		public int code{ set; get;}
		public int userId { set; get;}
	}

	class RegisterRequest {
		
	}

	class RegisterResponse {
		
	}

	class SelectTeamRequest {
		public int teamType { set; get;}
	}

	class SelectTeamResponse {
		
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
