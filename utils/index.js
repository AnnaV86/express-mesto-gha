module.exports.messagesError = (error) => Object.keys(error.errors)
  .map((el) => `${el} - ${error.errors[el].properties.message}`)
  .join(', ');
