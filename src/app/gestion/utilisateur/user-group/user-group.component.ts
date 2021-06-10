import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserGroup} from "../../../models/gestion/utilisateur/user-group";
import {UserGroupService} from "../../../services/gestion/utilisateur/user-group.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";

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
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {

    this.userGroupService.list().subscribe(
      (data: any) => {
        this.userGroupList = [...data];
        this.userGroupFiltered = this.userGroupList;
        console.log(this.userGroupList);
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

  makeForm(userGroup: UserGroup): void {
    this.validateForm = this.fb.group({
      id: [userGroup != null ? userGroup.id : null],
      name: [userGroup != null ? userGroup.name : null,
        [Validators.required]],
      description: [userGroup != null ? userGroup.description : null],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (userGroup?.id !=null){
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
      if (formData.id == null) {
        this.enregistrerUserGroup(formData);
      } else {
        this.modifierUserGroup(formData);
      }
    }
  }

  enregistrerUserGroup(userGroup: UserGroup): void {
    this.userGroupService.createUserGroup(userGroup).subscribe(
      (data: any) => {
        console.log(data);
        this.userGroupList.unshift(data);
        this.userGroupFiltered = [...this.userGroupList];
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
        console.log('Echec atatus ==> ' + error.status);
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
        }, 3000);
      });
  }

  modifierUserGroup(userGroup: UserGroup): void {
    this.userGroupService.updateUserGroup(userGroup).subscribe(
      (data: any) => {
        console.log(data);
        const i = this.userGroupList.findIndex(l => l.id == data.id);
        if (i > -1) {
          this.userGroupList[i] = data;
          this.userGroupFiltered = [...this.userGroupList];
        }
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.success('Enregistrement effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
        this.resetForm();
        //basculer vers la tab contenant la liste apres modification
        this.activeTabsNav = 1;
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
      this.userGroupService.deleteUserGroup(userGroup?.id).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.userGroupList.findIndex(l => l.id == userGroup.id);
          if (i > -1) {
            this.userGroupList.splice(i, 1);
            this.userGroupFiltered = [...this.userGroupList];
          }
          setTimeout(() => {
            this.toastr.success('Suppression effectuée avec succès.', 'Success!', {progressBar: true});
          }, 3000);
          this.resetForm();
        },
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> ' + error.status);
          setTimeout(() => {
            this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
          }, 3000);
        });
    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });
  }

}
