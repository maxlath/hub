import 'should'
import { get, shouldNotBeCalled } from './lib/utils.js'

describe('abuse filter', () => {
  it('should reject requests to /w paths', async () => {
    await shouldBeRejected('/w/load.php?hello=1')
    await shouldBeRejected('/wiki/Foo')
    await shouldBeRejected('/yo.php')
    await shouldBeRejected('/yo.php?bla=foo')
  })
})

async function shouldBeRejected (url) {
  try {
    const res = await get(url)
    shouldNotBeCalled(res)
  } catch (err) {
    err.statusCode.should.equal(403)
  }
}
