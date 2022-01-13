// require('should')
// const { get, undesiredRes, undesiredErr } = require('./lib/utils')

// describe('home', function () {
//   this.timeout(10000)
//   it('should resolve to /', async () => {
//     get('/')
//     .then(res => {
//       res.statusCode.should.equal(200)
//       done()
//     })
//     .catch(undesiredErr(done))
//   })

//   it('should redirect to /', async () => {
//     get('')
//     .then(res => {
//       res.statusCode.should.equal(302)
//       res.headers.get('location').should.equal('/')
//       done()
//     })
//     .catch(undesiredErr(done))
//   })
// })
