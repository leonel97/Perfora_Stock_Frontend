import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Section} from "../../../models/gestion/parametrage/section";
import {SectionService} from "../../../services/gestion/parametrage/section.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import { element } from 'protractor';


@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  sectionFiltered;

  validateForm: FormGroup;
  sectionList: Section[] = [];
  //nacList : Nac[] = [];
  loading: boolean;
  section: Section = null;
  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private sectionService: SectionService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  ngOnInit(): void {
    this.sectionService.list().subscribe(
      (data: any) => {
        this.sectionList = [...data];
        this.sectionFiltered = this.sectionList;
        console.log(this.sectionList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> '+error.status);
      });

    this.makeForm(null);

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filerData(value);
      });

      this.sectionService.list().subscribe(
        (data: any) => {
          this.sectionList = data;
        },
        (error: HttpErrorResponse) => {
          console.log('Echec chargement des sections -  status ==> ' + error.status);
        });

        


  }

  filerData(val) {
    if (val) {
      val = val.toLowerCase();
    } else {
      return this.sectionFiltered = [...this.sectionList];
    }

    const columns = Object.keys(this.sectionList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.sectionList.filter(function(d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.sectionFiltered = rows;
  }

 /* getnacsBySectionId(sectionId : number){
    this.nacList = [];
    this.sectionService.listNacsBySection(sectionId).subscribe(
      (data: any) => {
       this.nacList = data;
       // console.log("nacys",this.nacList);
       
      },
      (error: HttpErrorResponse) => {
        console.log('Echec chargement des sections -  status ==> ' + error.status);
      });
  }*/

  makeForm(section: Section): void {
    this.validateForm = this.fb.group({
      id: [section != null ? section.id: null],
      libelle: [section != null ? section.libelle: null,
        [Validators.required]],
        parentId: [section != null ? section.parentId: null],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (section?.id !=null){
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

    if(this.validateForm.valid == false) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.toastr.error('Veuillez remplir les champs convenablement.', ' Erreur !', {progressBar: true});
      }, 3000);
    } else  {
      const formData = this.validateForm.value;
      if(formData.id == null) {
        this.enregistrerSection(formData);
      } else {
        this.modifierSection(formData);
      }
    }
  }

  enregistrerSection(section: Section): void {
    this.sectionService.createSection(section).subscribe(
      (data: any) => {
        console.log(data);
        this.sectionList.unshift(data);
        this.sectionFiltered = [...this.sectionList];
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
      });
  }

  modifierSection(section: Section): void {
    this.sectionService.updateSection(section).subscribe(
      (data: any) => {
        console.log(data);
        const i = this.sectionList.findIndex(l => l.id == data.id);
        if(i > -1) {
          this.sectionList[i]= data;
          this.sectionFiltered = [...this.sectionList];
        }
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.toastr.success('Modification effectué avec succès.', 'Success!', {progressBar: true});
        }, 3000);
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
  }

  confirm(content, section) {
    this.section = section;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.sectionService.deleteSection(section?.id).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.sectionList.findIndex(l => l.id == section.id);
          if(i > -1) {
            this.sectionList.splice(i, 1);
            this.sectionFiltered = [...this.sectionList];
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

}
