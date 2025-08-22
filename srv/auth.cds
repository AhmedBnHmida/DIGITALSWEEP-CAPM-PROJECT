using myAuth from '../db/auth';

service AuthService {
  entity Users as projection on myAuth.Users;

  action register(username: String, email: String, password: String) returns {
    message: String;
    userId  : UUID;
  };

  action login(username: String, password: String) returns {
    message: String;
    userId  : UUID;
  };
}
