// You can use a logging library like winston here if you prefer
const logger = {
  error: (message) => console.error(message),
  warn: (message) => console.warn(message),
  info: (message) => console.info(message),
  debug: (message) => console.debug(message),
};

export default logger;
