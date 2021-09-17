
import { UserGroup } from '../../utilisateur/user-group';
import { DroitUser } from '../../utilisateur/droit-user';

export class EncapGroupDroits {

  constructor(public groupUser: UserGroup, public droitUsers: DroitUser[]){

  }


}
