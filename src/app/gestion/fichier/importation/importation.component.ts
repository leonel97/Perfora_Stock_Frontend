import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Article } from 'src/app/models/gestion/definition/article.model';
import { CentreConsommation } from 'src/app/models/gestion/definition/centreConsommation';
import { Direction } from 'src/app/models/gestion/definition/direction';
import { Famille } from 'src/app/models/gestion/definition/famille.model';
import { Fournisseur } from 'src/app/models/gestion/definition/fournisseur';
import { Magasin } from 'src/app/models/gestion/definition/magasin.model';
import { TypeArticle } from 'src/app/models/gestion/definition/typeArticle.model';
import { TypeCentreConsommation } from 'src/app/models/gestion/definition/typeCentreConsommation';
import { TypeFournisseur } from 'src/app/models/gestion/definition/typeFournisseur';
import { Uniter } from 'src/app/models/gestion/definition/uniter.model';
import { ArticleService } from 'src/app/services/gestion/definition/article.service';
import { CentreConsommationService } from 'src/app/services/gestion/definition/centreConsommation.service';
import { DirectionService } from 'src/app/services/gestion/definition/direction.service';
import { FamilleService } from 'src/app/services/gestion/definition/famille.service';
import { FournisseurService } from 'src/app/services/gestion/definition/fournisseur.service';
import { MagasinService } from 'src/app/services/gestion/definition/magasin.service';
import { TypeArticleService } from 'src/app/services/gestion/definition/type-article.service';
import { TypeCentreConsommationService } from 'src/app/services/gestion/definition/typeCentreConsommation.service';
import { TypeFournisseurService } from 'src/app/services/gestion/definition/typeFournisseur.service';
import { UniterService } from 'src/app/services/gestion/definition/uniter.service';
import * as xlsx from 'xlsx';

@Component({
  selector: 'app-importation',
  templateUrl: './importation.component.html',
  styleUrls: ['./importation.component.css']
})
export class ImportationComponent implements OnInit {

  loading: boolean = false;
  file: File;
  arrayBuffer:any;
  feuille:any;
  eventt:any;
  trigerred:boolean = false;
  repport1FormsGroup: FormGroup;

  constructor(private formBulder:FormBuilder, private toastr: ToastrService,
    private modalService: NgbModal, private directionService: DirectionService,
    private typeCentreService: TypeCentreConsommationService,
    private centreConsService: CentreConsommationService,
    private magasinService: MagasinService, private familleService: FamilleService,
    private typeArtiService: TypeArticleService, private articleService: ArticleService,
    private typeFrsService: TypeFournisseurService, private fournisseurService: FournisseurService,
    private uniterService: UniterService
    ) {
    this.repport1FormsGroup = this.formBulder.group({
      rep1Element:0,
      rep1File:''
    });
   }

  ngOnInit(): void {
  }

  getFile(event: any) {
    this.eventt = event;
    this.file = event.target.files[0];

    //console.log('event', event);
    //console.log('fichier', this.file);
    if(this.file !== undefined && this.file !== null) this.extraireDonnerFichier();

  }

  extraireDonnerFichier(){

    let fileReader = new FileReader();

    fileReader.onload = (e) => {

      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();

      //console.log('arraybuffer', this.arrayBuffer);
      //console.log('data', data);

      for (let i = 0; i !== data.length; i++) {
        arr[i] = String.fromCharCode(data[i]);
      }

      //console.log('Array', arr);

      const bstr = arr.join('');

      const workbook = xlsx.read(bstr, { type: 'binary', cellDates: true });
      //console.log('classeur', workbook);
      const first_sheet_name = workbook.SheetNames[0];

      const worksheet = workbook.Sheets[first_sheet_name];
      this.feuille = xlsx.utils.sheet_to_json(worksheet, { raw: true, header: 1 });


      this.toastr.success('Fichier Chargé avec Succès', 'Importation');

      //console.log('worksheet', worksheet);
      //console.log('sheet en JSON', this.feuille);

    };

    fileReader.readAsArrayBuffer(this.file);
  }

  onRep1GenerateClicked(){

    if(this.repport1FormsGroup.value['rep1Element'] == 0){

      let inde:number = 0;
      let listToSave: Direction[] = [];

      for(const element of this.feuille) {
        inde++;
        if(element[0] != undefined && element[1] != undefined){
          let direction = new Direction();
          direction.libDirection = element[1];
          direction.codeDirection = element[0];

          listToSave.push(direction);

          /*
          (function(i, directionService, toastr, nbrLigne){
            directionService.createDirection(direction).subscribe(
              (data) => {
                if(data == null){
                  console.log('le code de la ligne '+i+' existe déjà');
                  //this.toastr.error('le code de la ligne '+inde+' existe déjà', 'Importation d\'unité');
                }

                if(i == nbrLigne){
                  console.log('Fin de lImportation, Importation réuissir');
                  toastr.success('Importation éffectuée avec Succès', 'Importation de Direction');
                }

              },
              (erreur) => {
                console.log('Erreur lors de lAjout de la ligne '+i, erreur);
                toastr.error('Erreur lors de l\'Ajout de la ligne '+(i)+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Direction');
                return 1;
              }
            );

          })(inde, this.directionService, this.toastr, this.feuille.length);
          */

        }
        else {
          console.log('Erreur à la ligne '+inde+'Code ou libellé de Unité invalide');
          this.toastr.error('Erreur à la ligne '+(inde)+' Code ou libellé de Direction invalide', 'Importation de Direction');
          return;
        }


      }

      this.directionService.addAListDirection(listToSave).subscribe(
        (data) => {

          console.log('Fin de lImportation, Importation réuissir');
          this.toastr.success('Importation éffectuée avec Succès', 'Importation de Direction'); 

        },
        (erreur) => {
          console.log('Erreur lors de lAjout des ligne ', erreur);
          this.toastr.error('Erreur lors de l\'Ajout des Directions\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Direction');
          return 1;

        }
      );



    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 1){
      let inde:number = 0;
      let listToSave: TypeCentreConsommation[] = [];

      for(const element of this.feuille) {
        inde++;
        if(element[0] != undefined && element[1] != undefined){
          let typeCentre = new TypeCentreConsommation();
          typeCentre.libTypService = element[1];
          typeCentre.codeTypService = element[0];

          listToSave.push(typeCentre);

          /*
          (function(i, typeCentreService, toastr, nbrLigne){
            typeCentreService.createTypecentreConsommation(typeCentre).subscribe(
              (data) => {
                if(data == null){
                  console.log('le code de la ligne '+i+' existe déjà');
                  //this.toastr.error('le code de la ligne '+inde+' existe déjà', 'Importation d\'unité');
                }

                if(i == nbrLigne){
                  console.log('Fin de lImportation, Importation réuissir');
                  toastr.success('Importation éffectuée avec Succès', 'Importation de Type de Centre');
                }

              },
              (erreur) => {
                console.log('Erreur lors de lAjout de la ligne '+i, erreur);
                toastr.error('Erreur lors de l\'Ajout de la ligne '+(i)+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Type de Centre');
                return 1;
              }
            );

          })(inde, this.typeCentreService, this.toastr, this.feuille.length);
          */

        }
        else {
          console.log('Erreur à la ligne '+inde+'Code ou libellé de Unité invalide');
          this.toastr.error('Erreur à la ligne '+(inde)+' Code ou libellé de Type de Centre invalide', 'Importation de Type de Centre');
          return;
        }


      }

      this.typeCentreService.addAListTypeCentreConsommation(listToSave).subscribe(
        (data) => {

          console.log('Fin de lImportation, Importation réuissir');
          this.toastr.success('Importation éffectuée avec Succès', 'Importation de Type de Centre');

        },
        (erreur) => {
          console.log('Erreur lors de lAjout des ligne ', erreur);
          this.toastr.error('Erreur lors de l\'Ajout des Types de Centre de Co/989nsommation\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Type de Centre');
          return 1;
        }
      );

    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 2){
      this.typeCentreService.list().subscribe(
        (data1: TypeCentreConsommation[]) => {

          this.directionService.list().subscribe(
            (data2: Direction[]) => {

              this.centreConsService.list().subscribe(
                (data3: CentreConsommation[]) => {

                  
                let inde:number = 0;
                let listToSave: CentreConsommation[] = [];

                for (const element of this.feuille){

                  inde++;
                    if(element[0] != undefined && element[1] != undefined && element[2] != undefined
                      && element[3] != undefined){
                        let directi:Direction = null;
                        let typeCen:TypeCentreConsommation = null;
                        let finded1 = false;
                        let finded2 = false;
                        for(const element1 of data1) {
                          if(element1.codeTypService == element[3]){
                            typeCen = element1;
                            finded1 = true;
                            break;
                          }
                        }

                        if(!finded1){
                          console.log('Le code de Type de Centre à la ligne '+inde+' nExiste pas. Importation interrompu.');
                          this.toastr.error('Le code de Type Centre à la ligne '+inde+' n\'Existe pas. Importation interrompu.', 'Importation de Centre de Consommation');
                          return;
                        }

                        for(const element2 of data2) {
                          if(element2.codeDirection == element[2]){
                            directi = element2;
                            finded2 = true;
                            break;
                          }

                        }

                        if(!finded2){
                          console.log('Le code de Direction à la ligne '+inde+' nExiste pas. Importation interrompu.');
                          this.toastr.error('Le code de Direction à la ligne '+inde+' n\'Existe pas. Importation interrompu.', 'Importation de Centre de Consommation');
                          return;
                        }

                        

                        let superCentr: CentreConsommation = null;

                            if(element[4]){
                              for(const element3 of data3) {
                                if(element3.codeService == element[4]){
                                  superCentr = element3;

                                  break;
                                }

                              }

                            }

                            let centre = new CentreConsommation();
                            centre.codeService = element[0];
                            centre.libService = element[1];
                            centre.direction = directi;
                            centre.typeService = typeCen;
                            centre.superService = superCentr;

                            listToSave.push(centre);

                            /*

                              (function(i, centreConsService, toastr, nbrLigne){
                                centreConsService.createCentreConsommation(centre).subscribe(
                                  (data) => {
                                    if(data == null){
                                      console.log('le code de la ligne '+i+' existe déjà');

                                    }

                                    if(i == nbrLigne){
                                      console.log('Fin de lImportation, Importation réuissir');
                                      toastr.success('Importation éffectuée avec Succès', 'Importation de Centre de Consommation');
                                    }

                                  },
                                  (erreur) => {
                                    console.log('Erreur lors de lAjout de la ligne '+i, erreur);
                                    toastr.error('Erreur lors de l\'Ajout de la ligne '+i+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Centre de Consommation');
                                    return 1;
                                  }
                                );

                              })(inde, this.centreConsService, this.toastr, this.feuille.length);

                            */



                      }
                    else {
                      console.log('Erreur à la ligne '+inde+'invalidité dUne information');
                      this.toastr.error('Erreur à la ligne '+inde+'. Invalidité d\'Une information', 'Importation de Centre de Consommation');
                      return;
                    }



                }

                this.centreConsService.addAListCentreConsommation(listToSave).subscribe(
                  (data) => {

                    console.log('Fin de lImportation, Importation réuissir');
                    this.toastr.success('Importation éffectuée avec Succès', 'Importation de Centre de Consommation');
                  

                  },
                  (erreur) => {
                    console.log('Erreur lors de lAjout des ligne ', erreur);
                    this.toastr.error('Erreur lors de l\'Ajout des Centres de Consommation\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Centre de Consommation');
                    return 1;
                  }
                );

                  
                },
                (error: HttpErrorResponse) => {
                  console.log('Echec atatus ==> ' + error.status);
                  this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

                }
              );

            },
            (error: HttpErrorResponse) => {
              console.log('Echec atatus ==> ' + error.status);
              this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

            }
          );

        },
        (error: HttpErrorResponse) => {
          console.log('Echec atatus ==> ' + error.status);
          this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

        }
      );
    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 3){
      let inde:number = 0;
      let listToSave: Magasin[] = [];

      for(const element of this.feuille) {
        inde++;
        if(element[0] != undefined && element[1] != undefined){
          let magasin = new Magasin(element[0], element[1]);
          listToSave.push(magasin);

          /*
          (function(i, magasinService, toastr, nbrLigne){
            magasinService.addAMagasin(magasin).subscribe(
              (data) => {
                if(data == null){
                  console.log('le code de la ligne '+i+' existe déjà');
                  //this.toastr.error('le code de la ligne '+inde+' existe déjà', 'Importation d\'unité');
                }

                if(i == nbrLigne){
                  console.log('Fin de lImportation, Importation réuissir');
                  toastr.success('Importation éffectuée avec Succès', 'Importation de Magasin');
                }

              },
              (erreur) => {
                console.log('Erreur lors de lAjout de la ligne '+i, erreur);
                toastr.error('Erreur lors de l\'Ajout de la ligne '+(i)+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Magasin');
                return 1;
              }
            );

          })(inde, this.magasinService, this.toastr, this.feuille.length);
          */

        }
        else {
          console.log('Erreur à la ligne '+inde+'Code ou libellé de Unité invalide');
          this.toastr.error('Erreur à la ligne '+(inde)+' Code ou libellé de Magasin invalide', 'Importation de Magasin');
          return;
        }


      }

      this.magasinService.addAListMagasin(listToSave).subscribe(
        (data) => {

          console.log('Fin de lImportation, Importation réuissir');
          this.toastr.success('Importation éffectuée avec Succès', 'Importation de Magasin');
          

        },
        (erreur) => {
          console.log('Erreur lors de lAjout des ligne ', erreur);
          this.toastr.error('Erreur lors de l\'Ajout des Magasins\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Magasin');
          return 1;
        }
      );

    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 4){
 
      this.familleService.getAllFamille().subscribe(
        (data1) => {

          let inde:number = 0;
          let listToSave: Famille[] = [];
          for(const element of this.feuille) {
            inde++;
            if(element[0] != undefined && element[1] != undefined){
    
              let superFa: Famille = null;
              if(element[2]){
                for(const element1 of data1) {
                  if(element1.codeFamille == element[2]){
                    superFa = element1;
    
                    break;
                  }
                }
              }
    
              let famille = new Famille(element[0], element[1], superFa, null);
    
              listToSave.push(famille);
    
              /*
              (function(i, familleService, toastr, nbrLigne){
                familleService.addAFamille(famille).subscribe(
                  (data) => {
                    if(data == null){
                      console.log('le code de la ligne '+i+' existe déjà');
                      //this.toastr.error('le code de la ligne '+inde+' existe déjà', 'Importation d\'unité');
                    }
    
                    if(i == nbrLigne){
                      console.log('Fin de lImportation, Importation réuissir');
                      toastr.success('Importation éffectuée avec Succès', 'Importation de Famille d\'Article');
                    }
    
                  },
                  (erreur) => {
                    console.log('Erreur lors de lAjout de la ligne '+i, erreur);
                    toastr.error('Erreur lors de l\'Ajout de la ligne '+(i)+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Famille d\'Article');
                    return 1;
                  }
                );
    
              })(inde, this.familleService, this.toastr, this.feuille.length);
              */
    
    
    
    
            }
            else {
              console.log('Erreur à la ligne '+inde+'Code ou libellé de Unité invalide');
              this.toastr.error('Erreur à la ligne '+(inde)+' Code ou libellé de Famille invalide', 'Importation de Famille d\'Article');
              return;
            }
    
    
          }
    
          this.familleService.addAListFamille(listToSave).subscribe(
            (data) => {
             
              console.log('Fin de lImportation, Importation réuissir');
              this.toastr.success('Importation éffectuée avec Succès', 'Importation de Famille d\'Article');
            
            },
            (erreur) => {
              console.log('Erreur lors de lAjout des lignes ', erreur);
              this.toastr.error('Erreur lors de l\'Ajout des Articles \n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Famille d\'Article');
              return 1;
            }
          );
    

        },
        (error: HttpErrorResponse) => {
          console.log('Echec atatus ==> ' + error.status);
          this.toastr.error('Erreur avec le status ' + error.status, 'Erreur !', { timeOut: 5000 });

        }
      );


      
    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 5){
      let inde:number = 0;
      let listToSave: TypeArticle[] = [];

      for(const element of this.feuille) {
        inde++;
        if(element[0] != undefined && element[1] != undefined){
          let typeArticle = new TypeArticle(element[0], element[1]);
          listToSave.push(typeArticle);
          /*
          (function(i, typeArtiService, toastr, nbrLigne){
            typeArtiService.addATypeArticle(typeArticle).subscribe(
              (data) => {
                if(data == null){
                  console.log('le code de la ligne '+i+' existe déjà');
                  //this.toastr.error('le code de la ligne '+inde+' existe déjà', 'Importation d\'unité');
                }

                if(i == nbrLigne){
                  console.log('Fin de lImportation, Importation réuissir');
                  toastr.success('Importation éffectuée avec Succès', 'Importation de Type d\'Article');
                }

              },
              (erreur) => {
                console.log('Erreur lors de lAjout de la ligne '+i, erreur);
                toastr.error('Erreur lors de l\'Ajout de la ligne '+(i)+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Type d\'Article');
                return 1;
              }
            );

          })(inde, this.typeArtiService, this.toastr, this.feuille.length);
          */

        }
        else {
          console.log('Erreur à la ligne '+inde+'Code ou libellé de Unité invalide');
          this.toastr.error('Erreur à la ligne '+(inde)+' Code ou libellé de Type d\'Article invalide', 'Importation de Type d\'Article');
          return;
        }


      }

      this.typeArtiService.addAListTypeArticle(listToSave).subscribe(
        (data) => {

          console.log('Fin de lImportation, Importation réuissir');
          this.toastr.success('Importation éffectuée avec Succès', 'Importation de Type d\'Article');
          

        },
        (erreur) => {
          console.log('Erreur lors de lAjout des ligne ', erreur);
          this.toastr.error('Erreur lors de l\'Ajout des Types d\'Article\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Type d\'Article');
          return 1;
        }
      );

    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 6){

      this.familleService.getAllFamille().subscribe(
        (data1) => {
          this.typeArtiService.getAllTypeArticle().subscribe(
            (data2) => {
              let inde:number = 0;

              let listToSave: Article[] = [];

               for (const element of this.feuille) {
                  inde++;
                  if(element[0] != undefined && element[1] != undefined && typeof element[2] == 'number'
                    && typeof element[3] == 'number' && typeof element[4] != 'undefined'){
                      let famill:Famille = null;
                      let typeArt: TypeArticle = null;
                      let finded1 = false;

                      for(const element1 of data1) {
                        if(element1.codeFamille == element[4]){
                          famill = element1;
                          finded1 = true;
                          break;
                        }
                      }

                      if(!finded1){
                        console.log('Le code de Famille à la ligne '+inde+' nExiste pas. Importation interrompu.');
                        this.toastr.error('Le code de Famille à la ligne '+inde+' n\'Existe pas. Importation interrompu.', 'Importation d\'Article');
                        return;
                      }

                      if(element[5])
                      for(const element2 of data2) {
                        if(element2.codeTypeArt == element[5]){
                          typeArt = element2;
                          break;
                        }
                      }

                    let article = new Article(element[0], element[1], false, false, false, false, 0, null, 0, 0, null, null,
                      null, null, null, element[2], element[3], false, 0, 0, 0, 0, null, famill, null, typeArt);
                      
                    listToSave.push(article);
                      
                      /*
                      (function(i, articleService, toastr, nbrLigne){
                        articleService.addArticle(article).subscribe(
                          (data) => {
                            if(data == null){
                              console.log('le code de la ligne '+i+' existe déjà');

                            }

                            if(i == nbrLigne){
                              console.log('Fin de lImportation, Importation réuissir');
                              toastr.success('Importation éffectuée avec Succès', 'Importation d\'Article');
                            }

                          },
                          (erreur) => {
                            console.log('Erreur lors de lAjout de la ligne '+i, erreur);
                            toastr.error('Erreur lors de l\'Ajout de la ligne '+i+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation d\'Article');
                            return 1;
                          }
                        );

                      })(inde, this.articleService, this.toastr, this.feuille.length);
                      */


                    }
                  else {
                    console.log('Erreur à la ligne '+inde+'invalidité dUne information');
                    this.toastr.error('Erreur à la ligne '+inde+'. Invalidité d\'Une information', 'Importation d\'Article');
                    return;
                  }


              }

              this.articleService.addAListArticle(listToSave).subscribe(
                (data) => {

                  console.log('Fin de lImportation, Importation réuissir');
                  this.toastr.success('Importation éffectuée avec Succès', 'Importation d\'Article');


                },
                (erreur) => {
                  console.log('Erreur lors de lAjout des ligne ', erreur);
                  this.toastr.error('Erreur lors de l\'Ajout des Articles\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation d\'Article');
                  return 1;
                }
              );


            },
            (erreur) => {
              console.log('Erreur lors de la récupération des Unités', erreur);
              this.toastr.error('Erreur lors de la récupération des Unités'+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation d\'Article');
            }
          );
        },
        (erreur) => {
          console.log('Erreur lors de la récupération des familles', erreur);
          this.toastr.error('Erreur lors de la récupération des familles'+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation d\'Article');
        }
      );


    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 7){
      let inde:number = 0;
      let listToSave: TypeFournisseur[] = [];

      for(const element of this.feuille) {
        inde++;
        if(element[0] != undefined && element[1] != undefined){
          let typeFrs = new TypeFournisseur();
          typeFrs.codeCatFrs = element[0];
          typeFrs.libCatFrs = element[1];

          listToSave.push(typeFrs);

          /*
          (function(i, typeFrsService, toastr, nbrLigne){
            typeFrsService.createTypeFournisseur(typeFrs).subscribe(
              (data) => {
                if(data == null){
                  console.log('le code de la ligne '+i+' existe déjà');
                  //this.toastr.error('le code de la ligne '+inde+' existe déjà', 'Importation d\'unité');
                }

                if(i == nbrLigne){
                  console.log('Fin de lImportation, Importation réuissir');
                  toastr.success('Importation éffectuée avec Succès', 'Importation de Type de Fournisseur');
                }

              },
              (erreur) => {
                console.log('Erreur lors de lAjout de la ligne '+i, erreur);
                toastr.error('Erreur lors de l\'Ajout de la ligne '+(i)+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Type de Fournisseur');
                return 1;
              }
            );

          })(inde, this.typeFrsService, this.toastr, this.feuille.length);
          */


        }
        else {
          console.log('Erreur à la ligne '+inde+'Code ou libellé de Unité invalide');
          this.toastr.error('Erreur à la ligne '+(inde)+' Code ou libellé de Type d\'Article invalide', 'Importation de Type de Fournisseur');
          return;
        }


      }

      this.typeFrsService.addAListTypeFournisseur(listToSave).subscribe(
        (data) => {

          console.log('Fin de lImportation, Importation réuissir');
          this.toastr.success('Importation éffectuée avec Succès', 'Importation de Type de Fournisseur');
        
        },
        (erreur) => {
          console.log('Erreur lors de lAjout des lignes ', erreur);
          this.toastr.error('Erreur lors de l\'Ajout des Types de Fournisseur\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Type de Fournisseur');
          return 1;
        }
      );

    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 8){

      this.typeFrsService.list().subscribe(
        (data2: TypeFournisseur[]) => {
          let inde:number = 0;
          let listToSave: Fournisseur[] = [];
           for (const element of this.feuille) {
              inde++;
              if(element[0] != undefined && element[1] != undefined && typeof element[6] != 'undefined'){

                  let typFrs:TypeFournisseur = null;

                  let finded2 = false;

                  for(const element2 of data2) {
                    if(element2.codeCatFrs == element[6]){
                      typFrs = element2;
                      finded2 = true;
                      break;
                    }

                  }

                  if(!finded2){
                    console.log('Le code de Catégorie de Fournisseur à la ligne '+inde+' nExiste pas. Importation interrompu.');
                    this.toastr.error('Le code de Catégorie de Fournisseur à la ligne '+inde+' n\'Existe pas. Importation interrompu.', 'Importation de Fournisseur');
                    return;
                  }

                let frs = new Fournisseur();
                frs.codeFrs = element[0];
                frs.identiteFrs = element[1];
                frs.telFRS = element[2];
                frs.numIfuFrs = element[3];
                frs.regComFrs = element[4];
                frs.domaineInterven = element[5];
                frs.categorieFrs = typFrs;

                listToSave.push(frs);

                /*
                  (function(i, fournisseurService, toastr, nbrLigne){
                    fournisseurService.createFournisseur(frs).subscribe(
                      (data) => {
                        if(data == null){
                          console.log('le code de la ligne '+i+' existe déjà');

                        }

                        if(i == nbrLigne){
                          console.log('Fin de lImportation, Importation réuissir');
                          toastr.success('Importation éffectuée avec Succès', 'Importation de Fournisseur');
                        }

                      },
                      (erreur) => {
                        console.log('Erreur lors de lAjout de la ligne '+i, erreur);
                        toastr.error('Erreur lors de l\'Ajout de la ligne '+i+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Fournisseur');
                        return 1;
                      }
                    );

                  })(inde, this.fournisseurService, this.toastr, this.feuille.length);
                */


                }
              else {
                console.log('Erreur à la ligne '+inde+'invalidité dUne information');
                this.toastr.error('Erreur à la ligne '+inde+'. Invalidité d\'Une information', 'Importation de Fournisseur');
                return;
              }


          }

          this.fournisseurService.addAListFournisseur(listToSave).subscribe(
            (data) => {

              console.log('Fin de lImportation, Importation réuissir');
              this.toastr.success('Importation éffectuée avec Succès', 'Importation de Fournisseur');
            

            },
            (erreur) => {
              console.log('Erreur lors de lAjout des ligne ', erreur);
              this.toastr.error('Erreur lors de l\'Ajout des Fournisseurs \n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Fournisseur');
              return 1;
            }
          );


        },
        (erreur) => {
          console.log('Erreur lors de la récupération des Unités', erreur);
          this.toastr.error('Erreur lors de la récupération des Catégories de Fournisseur'+'\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Fournisseur');
        }
      );


    }
    else if(this.repport1FormsGroup.value['rep1Element'] == 9){

      let inde:number = 0;
      let listToSave: Uniter[] = [];

      for(const element of this.feuille) {
        inde++;
        if(element[0] != undefined && element[1] != undefined && typeof(element[2])=='number'){
          let uniter = new Uniter(element[0], element[1], element[2]);
          listToSave.push(uniter);


        }
        else {
          console.log('Erreur à la ligne '+inde+'Code ou libellé de Unité invalide');
          this.toastr.error('Erreur à la ligne '+(inde)+' Code ou libellé de Magasin invalide', 'Importation de Magasin');
          return;
        }

      }

      this.uniterService.addAListUniter(listToSave).subscribe(
        (data) => {

          console.log('Fin de lImportation, Importation réuissir');
          this.toastr.success('Importation éffectuée avec Succès', 'Importation de Magasin');
          
        },
        (erreur) => {
          console.log('Erreur lors de lAjout des ligne ', erreur);
          this.toastr.error('Erreur lors de l\'Ajout des Uniters\n Code : '+erreur.status+' | '+erreur.statusText, 'Importation de Magasin');
          return 1;
        }
      );

    }
  }

  showFileContent(content) {

    this.modalService.open(content, {size: 'lg'})
      .result.then((result) => {

      }, (reason) => {
      console.log(`Dismissed with: ${reason}`);
    });
  }

}
