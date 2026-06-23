import type { DeviceType } from './device';

export interface AddNodePayload {
  id?: string;
  label?: string;
  type?: DeviceType;
  ip?: string;
  mac?: string;
}
