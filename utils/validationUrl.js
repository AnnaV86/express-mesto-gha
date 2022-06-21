module.exports.validationUrl = (url, helpers) => {
  const regex = /^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/g;
  if (regex.test(url)) {
    return url;
  }
  return helpers.error('Ошибка url');
};
