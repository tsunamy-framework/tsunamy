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

const Info = FgBlue;
const Warn = FgYellow;
const Error = FgRed;

export class Console {
  static time(): string {
    return (new Date()).toLocaleTimeString('en-US');
  }
  static Info(s: string) {
    console.log('[' + this.time() + ']' + Info + 'INFO:' + s + Reset);
  }
  static Warn(s: string) {
    console.log('[' + this.time() + ']' + Warn + 'WARN:' + s + Reset);
  }
  static Err(s: string)  {
    console.log('[' + this.time() + ']' + Error + 'ERR :' + s + Reset);
  }

  static Blue(s: string) {
    console.log(FgBlue + s + Reset);
  }
  static FgRed(s: string) {
    console.log(FgBlue + s + Reset);
  }

  static Logo(): string {
    return `
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     _____
    |_   _|___  _ _ ___ ___ _____ _ _
      | | |_ -|| | |   | . |     | | |
      |_| |___||___|_|_|__,|_|_|_|_  |
                                 |___|
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;
  }
  static LogoWithColor(): string {
    return `
    \x1b[34m~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    \x1b[34m _____     \x1b[37m
    \x1b[34m|_   _|___ \x1b[37m _ _ ___ ___ _____ _ _
    \x1b[34m  | | |_ -|\x1b[37m| | |   | . |     | | |
    \x1b[34m  |_| |___|\x1b[37m|___|_|_|__,|_|_|_|_  |
    \x1b[34m           \x1b[37m                  |___|
    \x1b[34m~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;
  }
}
