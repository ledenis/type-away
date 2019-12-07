const debug = process.env.DEBUG === 'true' || false

module.exports = {
  logger: getLogger(),
}

function getLogger() {
  return {
    error(msg, ...params) {
      console.error(msg, ...params)
    },
  
    log(msg, ...params) {
      console.log(msg, ...params)
    },
  
    debug(msg, ...params) {
      debug && console.log(msg, ...params)
    }
  }
}
