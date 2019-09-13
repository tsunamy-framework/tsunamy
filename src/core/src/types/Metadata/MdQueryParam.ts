import {QueryParam} from '../../decorators/options/QueryParam';

export interface MdQueryParam {
  index: number;
  functionName: string | symbol;
  key: string;
  options?: QueryParam;
}
