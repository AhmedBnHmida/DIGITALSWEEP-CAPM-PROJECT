namespace myAuth;

entity Users {
  key ID       : UUID;
  username     : String(50);
  email        : String(100);
  password     : String;    // hashed with bcrypt
  createdAt    : Timestamp;
}
