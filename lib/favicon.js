const maxAgeSixMonths = `max-age=${365 * 0.5 * 24 * 60 * 60}`

module.exports = publicFileRoot => (req, res) => {
  res.header('Cache-Control', maxAgeSixMonths)
  res.sendFile(`${publicFileRoot}favicon.ico`)
}
