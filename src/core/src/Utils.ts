export class Utils {

  static isEmptyJson(obj: any): boolean {
    return Object.entries(obj).length === 0 && obj.constructor === Object;
  }

  static isNotEmptyJson(obj: any): boolean {
    return !this.isEmptyJson(obj);
  }
}
