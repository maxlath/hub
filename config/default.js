module.exports = {
  host: 'http://localhost:2580',
  name: 'hub',
  port: 2580,
  root: '',
  base: function () {
    return this.host + this.root
  }
}
