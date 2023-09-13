class UserDTO {
  constructor(e) {
    this._id = e._id;
    this.name = e.name;
    this.username = e.username;
    this.email = e.email;
  }
}

module.exports = UserDTO;
