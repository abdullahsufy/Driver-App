class DetailDTO {
  constructor(e) {
    this._id = e._id;
    this.user = e.user;
    this.data = e.data;
    this.oldblnc = e.oldblnc;
  }
}

module.exports = DetailDTO;
