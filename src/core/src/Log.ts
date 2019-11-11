import {Configuration} from './types/Configuration';
import fs from 'fs';
import os from 'os';
import path from 'path';

const Reset = '\x1b[0m';
const Bright = '\x1b[1m';
const Dim = '\x1b[2m';
const Underscore = '\x1b[4m';
const Blink = '\x1b[5m';
const Reverse = '\x1b[7m';
const Hidden = '\x1b[8m';

const FgBlack = '\x1b[30m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';

const BgBlack = '\x1b[40m';
const BgRed = '\x1b[41m';
const BgGreen = '\x1b[42m';
const BgYellow = '\x1b[43m';
const BgBlue = '\x1b[44m';
const BgMagenta = '\x1b[45m';
const BgCyan = '\x1b[46m';
const BgWhite = '\x1b[47m';

/*const Info = FgBlue;
const Warn = FgYellow;
const Error = FgRed;*/

enum Level {
  DEBUG,
  INFO,
  WARN,
  ERROR
}

export class Log {
  private static locale: string;
  private static localeOption: any;
  private static logFileStopped = false;
  private static logFilePath: string;
  private static logLevel: Level = Level.INFO;

  static setLocale(configuration: Configuration): void {
    this.locale = configuration.locale || '';
    this.localeOption = configuration.localeOption || {};
  }

  /**
   * Init logging configuration: level, file path...
   *
   * @param configuration application's configuration
   */
  static initLog(configuration: Configuration): void {
    if (configuration.log) {
      if (configuration.log.level && Object.values(Level).includes(configuration.log.level)) {
        this.logLevel = Level[configuration.log.level as keyof typeof Level];
      }
      if (configuration.log.file) {
        this.logFilePath = configuration.log.file.path || '';
        this.checkAccessLogFile();
      }
    }
  }

  static blue(s: string) {
    console.log(FgBlue + s + Reset);
  }

  static logo(): string {
    return `
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     _____
    |_   _|___  _ _ ___ ___ _____ _ _
      | | |_ -|| | |   | . |     | | |
      |_| |___||___|_|_|__,|_|_|_|_  |
                                 |___|
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;
  }
  static logoWithColor(): string {
    return `
    \x1b[34m~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    \x1b[34m _____     \x1b[37m
    \x1b[34m|_   _|___ \x1b[37m _ _ ___ ___ _____ _ _
    \x1b[34m  | | |_ -|\x1b[37m| | |   | . |     | | |
    \x1b[34m  |_| |___|\x1b[37m|___|_|_|__,|_|_|_|_  |
    \x1b[34m           \x1b[37m                  |___|
    \x1b[34m~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;
  }

  static debug(message: string, ...optionalParams: any[]) {
    this.log(Level.DEBUG, message, false, optionalParams);
  }
  static info(message: string, ...optionalParams: any[]) {
    this.log(Level.INFO, message, false, optionalParams);
  }
  static warn(message: string, ...optionalParams: any[]) {
    this.log(Level.WARN, message, false, optionalParams);
  }
  static err(message: string, ...optionalParams: any[])  {
    this.log(Level.ERROR, message, true, optionalParams);
  }

  /**
   * Log a message in console and file
   *
   * @param level of the log
   * @param message to log
   * @param stack true if we log the stack (useful to see where we are)
   * @param optionalParams optional params to log after message
   */
  private static log(level: Level, message: string, stack: boolean, optionalParams: any[])  {
    const messageWithStack = new Error(message).stack;
    const messageToLog = stack && messageWithStack ? messageWithStack : message;
    if (this.hasToBeLogged(level)) {
      this.logInConsole(level, messageToLog, optionalParams);
      this.logInFile(level, messageToLog, optionalParams);
    }
  }
  private static logInConsole(level: Level, message: string, optionalParams: any[])  {
    const toLog: string = this.colorFromLevel(level) + this.time() + this.levelToString(level) + message + Reset;
    if (optionalParams.length) {
      console.log(toLog, optionalParams);
    } else {
      console.log(toLog);
    }
  }
  private static logInFile(level: Level, message: string, optionalParams: any[]) {
    if (this.logFileEnabled()) {
      try {
        const messageLogged = message.concat(optionalParams
            .map(param => {
              return JSON.stringify(param);
            })
            .join());
        fs.appendFileSync(this.logFilePath, this.time() + this.levelToString(level) + messageLogged + os.EOL);
      } catch (e) {
        this.err(e.message);
      }
    }
  }
  private static levelToString(level: Level): string {
    switch (level) {
      case Level.ERROR:
        return 'ERROR: ';
      case Level.INFO:
        return 'INFO: ';
      case Level.WARN:
        return 'WARN: ';
      case Level.DEBUG:
        return 'DEBUG: ';
    }
  }
  private static colorFromLevel(level: Level): string {
    switch (level) {
      case Level.ERROR:
        return FgRed;
      case Level.INFO:
        return FgBlue;
      case Level.WARN:
        return FgYellow;
      case Level.DEBUG:
        return FgGreen;
    }
  }
  private static hasToBeLogged(level: Level): boolean {
    return !this.logLevel || level >= this.logLevel;
  }
  private static logFileEnabled(): boolean {
    return !this.logFileStopped && this.logFilePath != null; // juggling-check: null or undefined
  }
  private static time(): string {
    return '[' + (new Date()).toLocaleString(this.locale, this.localeOption) + ']';
  }
  private static recursiveMkdir(dir: string): void {
    try {
      fs.mkdirSync(dir);
    } catch (e) {
      if (e.code === 'ENOENT') {
        this.recursiveMkdir(path.dirname(dir));
        this.recursiveMkdir(dir);
      }
      if (e.code !== 'EEXIST') {
        throw e;
      }
    }
  }

  /**
   * Check if we can access to the log file, if not we stop to log in file
   * and log only to console
   */
  private static checkAccessLogFile() {
    try {
      this.recursiveMkdir(path.dirname(this.logFilePath));
      fs.openSync(this.logFilePath, 'a');
    } catch (e) {
      this.logFileStopped = true;
      this.err('Error during log file creation (' + this.logFilePath + '): ' + e.message);
    }
  }
}
