using myAuth from '../db/auth';

service AuthService {

  entity Users as projection on myAuth.Users;

  action register(username: String, email: String, password: String) returns {
    message: String;
    userId  : UUID;
  };

  action login(email: String, password: String) returns {
    message: String;
    userId  : UUID;
  };

  // Action for edit user profile
  action updateUser(ID: UUID, username: String, password: String) returns {
    message: String;
  };
}
