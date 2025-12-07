export function homeControllerFactory (publicFileRoot) {
  return function homeController (req, res) {
    res.sendFile(publicFileRoot + 'home.html')
  }
}
