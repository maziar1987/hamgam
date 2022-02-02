import {PolicySet} from './policy.model';

export class SetPolicysetModel {
  policySet: PolicySet[] = [];
  user: string;
  targetId: number;
  type: string;
  policySetIds: number[] = [];
}
