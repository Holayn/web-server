const camp = require('./camp');

module.exports = file => {
  if (camp.isValidFile(file.filename)) {
    return ['Camping Trip - October 17, 2021'];
  }

  return [];
}