const debug = process.env.DEBUG === 'true' || false

class Logger {
  error(msg, ...params) {
    console.error(msg, ...params)
  }

  log(msg, ...params) {
    console.log(msg, ...params)
  }

  debug(msg, ...params) {
    debug && console.log(msg, ...params)
  }
}

export const logger = new Logger()
