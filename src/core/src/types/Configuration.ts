/** Main configuration */
export type Configuration = {
  /** Application host name. expemple: localhost */
  hostname: string,
  /** Application port.exemple: 8080 */
  port: number,
  /**You want use https ? */
  https: boolean,
  /** api url start by pathAPI exemple: 127.0.0.1:3000/api/mypath */
  pathAPI: string,
  /** path of the project exemple: __dirname */
  projectDirectory: string
}
