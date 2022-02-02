import { User } from 'src/app/user/user.model';
// import { Role } from 'src/app/role/role.model';

export interface OrgunitCreate {
  parentId: number;
  displayName: string;
  usersid?: string[];
  rolesid?:string[];
}
export interface OrgunitEdit {
  id: number;
  parentId: number;
  displayName: string;
  usersid?: string[];
  rolesid?:string[];
}
export interface Orgunit {
  id: number;
  parentId: number;
  displayName: string;
  code:string;
  usersid?: string[];
  rolesid?:string[];
}
export interface OrgunitWhitUser{
  id: number;
  parentId: number;
  displayName: string;
  code:string;
  users: User[];
  // roles:Role[];
}
