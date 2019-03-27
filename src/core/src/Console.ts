let Reset = "\x1b[0m"
let Bright = "\x1b[1m"
let Dim = "\x1b[2m"
let Underscore = "\x1b[4m"
let Blink = "\x1b[5m"
let Reverse = "\x1b[7m"
let Hidden = "\x1b[8m"

let FgBlack = "\x1b[30m"
let FgRed = "\x1b[31m"
let FgGreen = "\x1b[32m"
let FgYellow = "\x1b[33m"
let FgBlue = "\x1b[34m"
let FgMagenta = "\x1b[35m"
let FgCyan = "\x1b[36m"
let FgWhite = "\x1b[37m"

let BgBlack = "\x1b[40m"
let BgRed = "\x1b[41m"
let BgGreen = "\x1b[42m"
let BgYellow = "\x1b[43m"
let BgBlue = "\x1b[44m"
let BgMagenta = "\x1b[45m"
let BgCyan = "\x1b[46m"
let BgWhite = "\x1b[47m"

let Info = FgBlue
let Warn = FgYellow
let Error = FgRed

export class Console {
  static time():string {return (new Date()).toLocaleTimeString('en-US')}
  static Info(s:string) { console.log('[' + this.time() + ']' + Info + 'INFO:' + s + Reset)};
  static Warn(s:string) { console.log('[' + this.time() + ']' + Warn + 'WARN:' + s + Reset)};
  static Err(s:string)  { console.log('[' + this.time() + ']' + Error + 'ERR :' + s + Reset)};

  static Blue(s:string) { console.log(FgBlue + s + Reset)};
  static FgRed(s:string) { console.log(FgBlue + s + Reset)};

  static Logo():string {
    return `
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   _____
  |_   _|___  _ _ ___ ___ _____ _ _
    | | |_ -|| | |   | . |     | | |
    |_| |___||___|_|_|__,|_|_|_|_  |
                               |___|
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;
  }
  static LogoWithColor():string {
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
