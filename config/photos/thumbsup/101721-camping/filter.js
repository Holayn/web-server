const camp = require('./camp');

module.exports = file => {
  return camp.isValidFile(file.filename);
}