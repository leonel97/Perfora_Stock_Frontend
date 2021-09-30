import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../models/gestion/utilisateur/user";
import {UserGroup} from "../../../models/gestion/utilisateur/user-group";
import {UserGroupService} from "../../../services/gestion/utilisateur/user-group.service";
import {UserService} from "../../../services/gestion/utilisateur/user.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import {CorpsJuridique} from "../../../models/gestion/parametrage/corps-juridique";
import {CorpsJuridiqueService} from "../../../services/gestion/parametrage/corps-juridique.service";
import {Fonction} from "../../../models/gestion/parametrage/fonction";
import {FonctionService} from "../../../services/gestion/parametrage/fonction.service";
import {Civilite} from "../../../models/gestion/parametrage/civilite";
import {CiviliteService} from "../../../services/gestion/parametrage/civilite.service";
import {CentreConsommation} from "../../../models/gestion/definition/centreConsommation";
import {CentreConsommationService} from "../../../services/gestion/definition/centreConsommation.service";
import {Profession} from "../../../models/gestion/parametrage/profession";
import {ProfessionService} from "../../../services/gestion/parametrage/profession.service";
import { EncapUserGroup } from 'src/app/models/gestion/saisie/encapsuleur-model/encapUserGroupe.model';
import { Magasin } from 'src/app/models/gestion/definition/magasin.model';
import { MagasinService } from 'src/app/services/gestion/definition/magasin.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  userFiltered;
  validateForm: FormGroup;
  userList: User[] = [];
  userGroupList: UserGroup[] = [];
  corpsList: CorpsJuridique[] = [];
  professionList: Profession[] = [];
  civiliteList: Civilite[] = [];
  fonctionList: Fonction[] = [];
  //serviceList: ServiceJuridique[] = [];
  loading: boolean;
  user: User = null;

  
  centreConsommationList: CentreConsommation[] = [];
  magasinList: Magasin[] = [];
  userGroupListForUser: UserGroup[] = [];
  userGroupListUser: UserGroup[] = [];

  //pour les tabs navs
  activeTabsNav;
  //end
  constructor(
    private userGroupService: UserGroupService,
    private civiliteService: CiviliteService,
    private fonctionService: FonctionService,
    private centreConsommationService: CentreConsommationService,
    private professionService: ProfessionService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private magasinService: MagasinService,
  ) { }

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  ngOnInit(): void {
 //magasin list
    this.magasinService.getAllMagasin().subscribe(
      (data) => {
        this.magasinList = [...data];
        console.log('Magasin List',this.magasinList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> '+error.status);
      });

      //user list
    this.getAllUser();

      //profession 

      this.professionService.list().subscribe(
        (data: any) => {
          this.professionList = [...data];
          //this.userFiltered = this.userList;
          //console.log(this.userList);
        },
        (error: HttpErrorResponse) => {
          console.log('Echec atatus ==> '+error.status);
        });

      // centre de consommation
      this.centreConsommationService.list().subscribe(
        (data: any) => {
          this.centreConsommationList = [...data];
         // this.centreConsommationFiltered = this.centreConsommationList.sort((a, b) => a.codeService.localeCompare(b.codeService));
          console.log(this.centreConsommationList);
        },
        (error: HttpErrorResponse) => {
          console.log('Echec atatus ==> ' + error.status);
        });

    this.userGroupService.list().subscribe(
      (data: any) => {
        this.userGroupList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec chargement des types - atatus ==> ' + error.status);
      });

    this.civiliteService.list().subscribe(
      (data: any) => {
        this.civiliteList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec chargement des civilités -  status ==> ' + error.status);
      });

    this.fonctionService.list().subscribe(
      (data: any) => {
        this.fonctionList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec chargement des fonctions  -  status ==> ' + error.status);
      });

   /* this.serviceJuridiqueService.list().subscribe(
      (data: any) => {
        this.serviceList = data;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec chargement des services juridiques  -  status ==> ' + error.status);
      });*/

    this.makeForm(null);

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filerData(value);
      });
  }

  filerData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      return this.userFiltered = [...this.userList];
    }

    const columns = Object.keys(this.userList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.userList.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.userFiltered = rows;
  }

  makeForm(user: User): void {
    
    this.validateForm = this.fb.group({
      idUtilisateur: [user != null ? user.idUtilisateur: null],
      login: [user != null ? user.login: null, [Validators.required]],
      motDePass: [user != null ? user.motDePass: null],
      nomUtilisateur: [user != null ? user.nomUtilisateur: null,[Validators.required]],
      prenomUtilisateur: [user != null ? user.prenomUtilisateur: null,[Validators.required]],
      activeUtilisateur: [user != null ? user.activeUtilisateur: false],
      dateLastConnex: [user != null ? user.dateLastConnex: null],
      askMdp1erLance: [user != null ? user.askMdp1erLance: true],
      accesChildService: [user != null ? user.accesChildService: true],
      civilite: [user != null ? user.civilite: null,[Validators.required]],
      profession: [user != null ? user.profession: null],
      fonction: [user != null ? user.fonction: null],
      service: [user != null ? user.service: null],
      magasins: [[]],
      password_confirmation: [user != null ? user.motDePass: null],
      groupUser: [[]]
    });

    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (user?.idUtilisateur !=null){
     this.userService.getAllGroupUserForUser(user?.idUtilisateur).subscribe(
       (data:[UserGroup]) => {
        let tab = [];
        data.forEach(element => {
          tab.push(element.numGroupUser);
        });

        let tab2 = [];
        user.magasins.forEach(element => {
          tab2.push(element.numMagasin);
        });
        
        this.activeTabsNav = 2; 

        this.validateForm.patchValue({
          groupUser: tab
        });
        this.validateForm.patchValue({
          magasins: tab2
        });

        
       },
       (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> '+error.status);
       }
     );

      
    }

  }

  //get all User
  getAllUser(){
    this.userService.list().subscribe(
      (data: any) => {
        this.userList = [...data];
        this.userFiltered = this.userList;
        console.log('user list',this.userList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> '+error.status);
      });
  }

  resetForm(): void {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.makeForm(null);
  }

  submit(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if(this.validateForm.valid == false) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez remplir les champs convenablement.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else  {

      
      const formData = this.validateForm.value;

      let tab: UserGroup[] = [];

      formData.groupUser.forEach((element) => {
        for (const fa of this.userGroupList){
          if(element == fa.numGroupUser){
            tab.push(fa);
            break;
          }
        }
      });
     // formData.groupUser = tab;

      //construire objet magasin

      let tab2: Magasin[] = [];

      formData.magasins.forEach((element) => {
        for (const ma of this.magasinList){
          if(element == ma.numMagasin){
            tab2.push(ma);
            break;
          }
        }
      });

      //formData.magasins = tab2;

      let userObject = new User(this.validateForm.value.login, this.validateForm.value.motDePass, this.validateForm.value.nomUtilisateur, 
        this.validateForm.value.prenomUtilisateur, true, null, true, true, this.validateForm.value.civilite, this.validateForm.value.profession,
        this.validateForm.value.fonction, this.validateForm.value.service, tab2);


      console.log('Objet avant enregistrement');
      console.log(formData);
      console.log('user object');
      console.log(userObject);
      console.log('GroupUser object');
      console.log(tab);
      console.log(formData.groupUser);

      if(formData.idUtilisateur == null) {
        this.enregistrerUser(userObject, tab);
      } else {
        this.modifierUser(formData.idUtilisateur,userObject, tab);
      }
    }
  }

  enregistrerUser(user: User, userGroup: UserGroup[]): void {
    
    this.loading = true;

    console.log('objet', new EncapUserGroup(user, userGroup));

    this.userService.createUser2(new EncapUserGroup(user, userGroup)).subscribe(
      (data: any) => {
        console.log(data);
        /*this.userList.unshift(data);
        this.userFiltered = [...this.userList];*/
        this.getAllUser();
        this.resetForm();
        setTimeout(() => {
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
        this.loading = false;
        //basculer vers la tab contenant la liste apres enregistrement
        this.activeTabsNav = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> '+error.status);
        //this.loading = true;
        setTimeout(() => {
          this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', {progressBar: true});
        }, 3000);
        this.loading = false;
      });
    /*this.userService.createUser(user).subscribe(
      (data: any) => {
        console.log(data);
        this.userList.unshift(data);
        this.userFiltered = [...this.userList];
        this.resetForm();
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
        //basculer vers la tab contenant la liste apres enregistrement
        this.activeTabsNav = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> '+error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', {progressBar: true});
        }, 3000);
      });*/
  }

  modifierUser(idUser: string, user: User, userGroup: UserGroup[]): void {
    this.loading = true;
    this.userService.updateUser2(idUser, new EncapUserGroup(user, userGroup)).subscribe(
      (data: any) => {
        console.log(data);
        
        
        /*const i = this.userList.findIndex(l => l.idUtilisateur == data.idUtilisateur);
        if(i > -1) {
          this.userList[i]= data;
          this.userFiltered = [...this.userList];
        }*/
        this.getAllUser();
        setTimeout(() => {
          
          this.toastr.success('Modification effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
        this.loading = false;
        this.resetForm();
        this.activeTabsNav = 1; 
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> '+error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', {progressBar: true});
        }, 3000);
      });
    /*this.userService.updateUser(idUser,user).subscribe(
      (data: any) => {
        console.log(data);
        const i = this.userList.findIndex(l => l.idUtilisateur == data.idUtilisateur);
        if(i > -1) {
          this.userList[i]= data;
          this.userFiltered = [...this.userList];
        }
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.success('Modification effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
        this.resetForm();
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> '+error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', {progressBar: true});
        }, 3000);
      });*/
  }

  confirm(content, user) {
    this.user = user;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.userService.deleteUser2(user?.idUtilisateur).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.userList.findIndex(l => l.idUtilisateur == user.idUtilisateur);
          if(i > -1) {
            this.userList.splice(i, 1);
            this.userFiltered = [...this.userList];
          }
          setTimeout(() => {
            this.toastr.success('Suppression effectuée avec succès.', 'Success!', {progressBar: true});
          }, 3000);
          this.resetForm();
        },
        (error: HttpErrorResponse) => {
          console.log('Echec atatus ==> '+error.status);
          setTimeout(() => {
            this.toastr.error('Erreur avec le status '+error.status, ' Erreur !', {progressBar: true});
          }, 3000);
        });
    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });
  }

  //Léo
  choixPushPup(){
    console.log(this.validateForm.value.groupUser);
  }
  choixPushPupMagasins(){
    console.log(this.validateForm.value.magasins);

  }

 
 
 

}
