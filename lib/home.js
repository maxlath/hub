module.exports = publicFileRoot => (req, res) => {
  res.sendFile(publicFileRoot + 'home.html')
}
