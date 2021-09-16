import { User } from '../../utilisateur/user';
import { UserGroup } from '../../utilisateur/user-group';

export class EncapUserGroup {

  constructor(public utilisateur: User, public groupUsers: UserGroup[]){

  }


}
