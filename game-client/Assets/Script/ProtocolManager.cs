using System.Collections;

namespace ProtocolManager{
	public class LoginRequest {
		public string username{ set; get;}
		public string password{ set; get;}
	}

	public class LoginResponse {
		public long userId { set; get;}
	}
}
