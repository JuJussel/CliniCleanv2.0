let url = location.host
url = url.split(':')

export default {
  apiURL: 'https://' + url[0], // Middleware
  socketIOIP: 'https://' + url[0] + ':1337', // Notification Server
  fileUploadURL: '/ccapi/insert/common/uploadFile.php', // needed fo file upload since cannot use a function
  mapUrl: 'https://' + url[0] + '/MAPS/tileserver.php'
}
