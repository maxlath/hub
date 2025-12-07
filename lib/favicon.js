const maxAgeSixMonths = `max-age=${365 * 0.5 * 24 * 60 * 60}`

export function faviconMiddlewareFactory (publicFileRoot) {
  return function faviconMiddleware (req, res) {
    res.header('Cache-Control', maxAgeSixMonths)
    res.sendFile(`${publicFileRoot}favicon.ico`)
  }
}
