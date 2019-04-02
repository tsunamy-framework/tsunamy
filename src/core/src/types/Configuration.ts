/** Main configuration */
export interface Configuration {
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
}
