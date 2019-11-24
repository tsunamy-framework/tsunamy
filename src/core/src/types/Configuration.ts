/** Main configuration */
export interface Configuration {
  /** Application language exemple 'en-US' use BCP 47 language tag */
  locale?: string;
  /** Application language option exemple {hour12 : false} */
  localeOption?: any;
  /** CORS for cross-origin */
  allowOrigins?: string[];
  allowMethods?: string[];
  allowHeaders?: string[];
  /** Application host name. expemple: localhost */
  hostname: string;
  /** You want use http ? */
  http: boolean;
  /** Application port.exemple: 8080 */
  httpPort: number;
  /** You want use https ? */
  https: boolean;
  /** Application https port.exemple: 8080 */
  httpsPort: number;
  /** api url start by pathAPI exemple: 127.0.0.1:3000/api/mypath */
  pathAPI: string;
  /** path of the project exemple: __dirname */
  projectDirectory: string;
  /** Object used to manage log (optionnal) */
  log?: {
    /** Level min to log */
    level?: string;
    file?: {
      /** Path of the file */
      path: string;
    }
    /** True to display object in one line (default: true), used by util.inspect method */
    displayCompactObject?: boolean | number;
    /** Specifies the number of times to recurse while formatting object to log (default: Infinity), used by util.inspect method */
    displayDepthObject?: number;
    /** The length at which input values are split across multiple lines (default: Infinity), used by util.inspect method */
    breakLength?: number;
  };
}
