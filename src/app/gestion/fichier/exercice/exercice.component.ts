import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpErrorResponse} from "@angular/common/http";
import {debounceTime} from "rxjs/operators";
import {Exercice} from "../../../models/gestion/fichier/exercice";
import {ExerciceService} from "../../../services/gestion/fichier/exercice.service";
import { AuthService } from 'src/app/services/common/auth.service';
@Component({
  selector: 'app-exercice',
  templateUrl: './exercice.component.html',
  styleUrls: ['./exercice.component.css']
})
export class ExerciceComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  exerciceFiltered;

  validateForm: FormGroup;
  exerciceList: Exercice[] = [];
  loading: boolean;
  exoCloture: boolean = false ;
  exercice: Exercice = null;

  disabledBtnCloturer: boolean;

  activeExercice: Exercice = null;

  //pour les tabs navs
  activeTabsNav;
  //end

  constructor(
    private exerciceService: ExerciceService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {

    this.disabledBtnCloturer = true;

    this.exerciceService.list().subscribe(
      (data: any) => {
        this.exerciceList = [...data];
        this.exerciceFiltered = this.exerciceList.sort((a, b) => a.codeExercice.localeCompare(b.codeExercice));
        console.log(this.exerciceList);
      },
      (error: HttpErrorResponse) => {
        console.log('Echec status ==> ' + error.status);
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
      return this.exerciceFiltered = [...this.exerciceList.sort((a, b) => a.codeExercice.localeCompare(b.codeExercice))];
    }

    const columns = Object.keys(this.exerciceList[0]);
    if (!columns.length) {
      return;
    }

    const rows = this.exerciceList.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        const column = columns[i];
        // console.log(d[column]);
        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });
    this.exerciceFiltered = rows;
  }

  // selected Exercice 
  selectOne(e, exo) {
    
    if (exo.isSelected == true) {
      this.activeExercice = exo;

      if (this.activeExercice.cloturerExo == true){
        this.disabledBtnCloturer = true;
        console.log("exoCl",exo);
        this.exerciceService.selectedExo = exo;
       
      }
      else{
        this.disabledBtnCloturer = false;
        console.log("exoCl",exo);
        this.exerciceService.selectedExo = exo;

      }

      for (let dossierDec of this.exerciceFiltered){
        if (dossierDec.numExercice !== exo.numExercice){
          dossierDec.isSelected = false;
        }
      }
      
      
   
    } else {
      this.disabledBtnCloturer = true;
      this.activeExercice = null;
    }
  }

  //show modal cloture exercice
  gererClotureExercice(contentCloture){
    if (this.activeExercice !== null){
      console.log(' Exercice active est ===>', this.activeExercice);
      //let new_progressionDossier = new ProgressionDossier();
     // this.makeFormProgressionDossier(new_progressionDossier);
    }
    else {
      console.log('Aucun exercice selectionner');
    }

    this.modalService.open(contentCloture, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {

    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });

  }

  makeForm(exercice: Exercice): void {
    this.validateForm = this.fb.group({
      numExercice: [exercice != null ? exercice.numExercice : null],
      libExercice: [exercice != null ? exercice.libExercice : null,[Validators.required]],
      codeExercice: [exercice != null ? exercice.codeExercice: null, [Validators.required]],
      dateDebut: [exercice != null ? exercice.dateDebut: new Date(), [Validators.required]],
      dateFin: [exercice != null ? exercice.dateFin: new Date(), [Validators.required]],
      etatExo: [exercice != null ? exercice.etatExo: null],
      cloturerExo: [exercice != null ? exercice.cloturerExo: false],
    });
    //cette condition permet de basculer vers la tab contenant le formulaire lors d'une modification
    if (exercice?.numExercice !=null){
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
      if (formData.numExercice == null) {
        console.log("data", formData);
      
        // verification d'un exerce non cloturé lors de la création d'un noouveau exercice
        this.exerciceFiltered.forEach(element => {
          if(element.cloturerExo == false)
          {
            this.exoCloture = true;
          }
          
        });
        if ( this.exoCloture == true ){
          this.toastr.error('Veuillez clôturez l\'exercice encours.', ' Attention !', {progressBar: true});
        }
        else{
          this.enregistrerExercice(formData);
        }
      } else {
        this.modifierExercice(formData.numExercice,formData);
      }
    }
  }

  enregistrerExercice(exercice: Exercice): void {
    this.exerciceService.createExercice(exercice).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        this.exerciceList.unshift(data);
        this.exerciceFiltered = [...this.exerciceList.sort((a, b) => a.codeExercice.localeCompare(b.codeExercice))];
        this.resetForm();
        this.toastr.success('Enregistrement effectué avec succès.', 'Success', { timeOut: 5000 });
        this.loading = false;
        //basculer vers la tab contenant la liste apres modification
        this.activeTabsNav = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
       
      });
  }

  modifierExercice(id: String, exercice: Exercice): void {
    this.exerciceService.updateExercice(id, exercice).subscribe(
      (data: any) => {
        console.log(data);
        this.loading = true;
        const i = this.exerciceList.findIndex(l => l.numExercice == data.numExercice);
        if (i > -1) {
          this.exerciceList[i] = data;
          this.exerciceFiltered = [...this.exerciceList.sort((a, b) => a.codeExercice.localeCompare(b.codeExercice))];
        }
        
        this.resetForm();
        this.toastr.success('Modification effectué avec succès.', 'Success', { timeOut: 5000 });
        
        //basculer vers la tab contenant la liste apres modification
        this.loading = false;
        this.activeTabsNav = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('Echec atatus ==> ' + error.status);
       
        this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
        
      });
  }

  confirm(content, exercice) {
    this.exercice = exercice;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true})
      .result.then((result) => {
      //this.confirmResut = `Closed with: ${result}`;
      this.exerciceService.deleteExercice(exercice?.numExercice).subscribe(
        (data: any) => {
          console.log(data);
          const i = this.exerciceList.findIndex(l => l.numExercice == exercice.numExercice);
          if (i > -1) {
            this.exerciceList.splice(i, 1);
            this.exerciceFiltered = [...this.exerciceList.sort((a, b) => a.codeExercice.localeCompare(b.codeExercice))];
          }
          /*setTimeout(() => {
            this.toastr.success('Suppression effectuée avec succès.', 'Success!', {progressBar: true});
          }, 3000);*/
          this.resetForm();
          this.toastr.success('Suppression effectué avec succès.', 'Success!', { timeOut: 5000 });
        },
        (error: HttpErrorResponse) => {
          console.log('Echec status ==> ' + error.status);
          this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
          /*setTimeout(() => {
            this.toastr.error('Erreur avec le status ' + error.status, ' Erreur !', {progressBar: true});
          }, 3000);*/
        });
    }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });
  }

    //clôture de l'exercice
    submitCloturerExercice() {

      this.activeExercice.cloturerExo = true;
      console.log("cloture222",this.activeExercice);
      
      //this.modifierExercice(this.activeExercice.numExercice.toString(),this.activeExercice);

     // this.toastr.success('Exercice clôturé avec succès', 'Success!', { timeOut: 5000 });

      this.exerciceService.updateExercice(this.activeExercice.numExercice.toString(), this.activeExercice).subscribe(
        (data: any) => {
          console.log(data);
          this.loading = true;
          const i = this.exerciceList.findIndex(l => l.numExercice == data.numExercice);
          if (i > -1) {
            this.exerciceList[i] = data;
            this.exerciceFiltered = [...this.exerciceList.sort((a, b) => a.codeExercice.localeCompare(b.codeExercice))];
          }
          
         // this.resetForm();
          this.toastr.success('Exercice clôturé avec succès.', 'Success', { timeOut: 5000 });
         this.disabledBtnCloturer = true;
          
          //basculer vers la tab contenant la liste apres modification
          this.loading = false;
          this.activeTabsNav = 1;
        },
        (error: HttpErrorResponse) => {
          console.log('Echec atatus ==> ' + error.status);
         
          this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });
          
        });
  
    }

}
