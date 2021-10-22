import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserGroup} from "../../../models/gestion/utilisateur/user-group";
import {DroitUser} from "../../../models/gestion/utilisateur/droit-user";
import {UserGroupService} from "../../../services/gestion/utilisateur/user-group.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import { EncapGroupDroits } from 'src/app/models/gestion/saisie/encapsuleur-model/encapGroupeDroit.model';
import { AuthService } from 'src/app/services/common/auth.service';

@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.css']
})
export class UserGroupComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  userGroupFiltered;

  validateForm: FormGroup;
  userGroupList: UserGroup[] = [];
  droitUserList: DroitUser[] = [];
  loading: boolean;
  userGroup: UserGroup = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private userGroupService: UserGroupService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {

    

     this.getAllGroupUser();
      //list droit user
      this.userGroupService.listDroitUser().subscribe(
        (data: any) => {
          this.droitUserList = [...data];
          console.log('Droit list',this.droitUserList);
        },
        (error: HttpErrorResponse) => {
          console.log('Echec atatus ==> ' + error.status);
        });

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
      return this.userGroupFiltered = [...this.userGroupList];
    }

    const columns = Object.keys(this.userGroupList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.userGroupList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.userGroupFiltered = rows;
  }

  //get all Group User
  getAllGroupUser(){
    this.userGroupService.list().subscribe(
      (data: any) => {
        this.userGroupList = [...data];
        this.userGroupFiltered = this.userGroupList;
        console.log(this.userGroupList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
      });
  }

  makeForm(userGroup: UserGroup): void {
    this.validateForm = this.fb.group({
      numGroupUser: [userGroup != null ? userGroup.numGroupUser : null],
      idGroupUser: [userGroup != null ? userGroup.idGroupUser : null,
        [Validators.required]],
        libGroupUser: [userGroup != null ? userGroup.libGroupUser : null,
          [Validators.required]],
        droits: [[]]
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (userGroup?.numGroupUser !=null){
      this.userGroupService.getAllDroitUserForGroupUser(userGroup?.numGroupUser).subscribe(
        (data: [DroitUser]) =>{
          let tab = [];
        data.forEach(element => {
          tab.push(element.idDroitUser);
        });

        this.validateForm.patchValue({
          droits: tab
        });


        }
      )
      this.activeTabsNav = 2;
    }
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

    if (this.validateForm.valid == false) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez remplir les champs convenablement.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else {
      const formData = this.validateForm.value;

      let tab: DroitUser[] = [];

      formData.droits.forEach((element) => {
        for (const du of this.droitUserList){
          if(element == du.idDroitUser){
            tab.push(du);
            break;
          }
        }
      });

      let groupUserObject = new UserGroup(formData.numGroupUser, formData.idGroupUser,formData.libGroupUser )
      console.log('objet avant enregistremrent');
      console.log(groupUserObject, tab);
      
      

      if (formData.numGroupUser == null) {
        this.enregistrerUserGroup(groupUserObject, tab);
      } else {
        this.modifierUserGroup(formData.numGroupUser, groupUserObject, tab);
      }
    }
  }

  enregistrerUserGroup(userGroup: UserGroup, droit: DroitUser[]): void {

    console.log('objet', new EncapGroupDroits(userGroup, droit));

    this.userGroupService.createGroupDroits(new EncapGroupDroits(userGroup, droit)).subscribe(
      (data: any) => {

        
        console.log(data);
        this.userGroupList.unshift(data);
        this.userGroupFiltered = [...this.userGroupList];

        this.getAllGroupUser();
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          //basculer vers la tab contenant la liste apres enregistrement
          this.activeTabsNav = 1;
          this.resetForm();
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);

      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
        }, 3000);
      });
  }

  modifierUserGroup(idGroup: string, groupUser: UserGroup, droit: DroitUser[]): void {
    this.userGroupService.updateGroupDroits(idGroup, new EncapGroupDroits(groupUser, droit)).subscribe( 
      (data: any) => {
        console.log(data);
        /*const i = this.userGroupList.findIndex(l => l.numGroupUser == data.numGroupUser);
        if (i > -1) {
          this.userGroupList[i] = data;
          this.userGroupFiltered = [...this.userGroupList];
        }*/
        this.getAllGroupUser();
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          //basculer vers la tab contenant la liste apres modification
          this.activeTabsNav = 1;
          this.resetForm();
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
        }, 3000);
      });
  }

  confirm(content, userGroup) {
    this.userGroup = userGroup;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.userGroupService.deleteGroupDroits(userGroup?.numGroupUser).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.userGroupList.findIndex(l => l.numGroupUser == userGroup.numGroupUser);
          if (i > -1) {
            this.userGroupList.splice(i, 1);
            this.userGroupFiltered = [...this.userGroupList];
          }
          /*setTimeout(() => {
            this.toastr.success('Suppression effectuée avec succès.', 'Success!', {progressBar: true});
          }, 3000);
          this.resetForm();*/
          
          this.toastr.success('Suppression effectuée avec succès.', 'Success!', {progressBar: true});
        },
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> ' + error.status);
          
          this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
          /*setTimeout(() => {
            this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
          }, 3000);*/
        });
    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });
  }

  //Léo
  choixPushPup(){
    console.log(this.validateForm.value.droits);
  }

}
