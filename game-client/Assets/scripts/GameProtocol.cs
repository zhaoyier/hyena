using SimpleJson;
using System.Collections;
using System.Runtime.Serialization;

namespace GameMessage {
	public class LoginRequest {
		public string username { set; get;}
		public string password { set; get;}

		public JsonObject decode(JsonObject jsonObject) {
			//SimpleJson.SimpleJson.SerializeObject ();
		}

		public JsonObject encode () {
			
		}


	}

	public class LoginResponse {
		
	}

	public class RegisterRequest {
		
	}

	public class RegisterResponse {
		
	}
}
//public class GameProtocol {

//}
