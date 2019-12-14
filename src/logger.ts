const debug = process.env.DEBUG === 'true' || false;

class Logger {
  error(msg: any, ...params: any[]) {
    console.error(msg, ...params);
  }

  warn(msg: any, ...params: any[]) {
    console.warn(msg, ...params);
  }

  log(msg: any, ...params: any[]) {
    console.log(msg, ...params);
  }

  debug(msg: any, ...params: any[]) {
    debug && console.log(msg, ...params);
  }
}

export const logger = new Logger();
