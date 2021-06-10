
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from "../../models/gestion/utilisateur/user";

export interface IMenuItem {
  id?: string;
  title?: string;
  description?: string;
  type: string;       // Possible values: link/dropDown/extLink
  name?: string;      // Used as display text for item and title for separator type
  state?: string;     // Router state
  icon?: string;      // Material icon name
  tooltip?: string;   // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
  active?: boolean;
}

export interface IChildItem {
  id?: string;
  parentId?: string;
  type?: string;
  name: string;       // Display text
  state?: string;     // Router state
  icon?: string;
  sub?: IChildItem[];
  active?: boolean;
}

interface IBadge {
  color: string;      // primary/accent/warn/hex color codes(#fff000)
  value: string;      // Display text
}

interface ISidebarState {
  sidenavOpen?: boolean;
  childnavOpen?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  public sidebarState: ISidebarState = {
    sidenavOpen: true,
    childnavOpen: false
  };
  selectedItem: IMenuItem;
  constructor() {
  }

  defaultMenu: IMenuItem[] = [
    {
      name: 'Dashboard',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      type: 'link',
      icon: 'i-Bar-Chart',
      state: '/gestion/dashboard'
    },
    {
      name: 'Paramétrage',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
      type: 'dropDown',
      icon: 'i-Gear',
      sub: [
        {icon: 'i-Arrow-Right', name: 'Langues', state: '/gestion/parametrage/langue', type: 'link'},
        {icon: 'i-Arrow-Right', name: 'Civilités', state: '/gestion/parametrage/civilite', type: 'link'},
        {icon: 'i-Arrow-Right', name: 'Années', state: '/gestion/parametrage/annee', type: 'link'},
        {icon: 'i-Arrow-Right', name: 'Types d\'évènement', state: '/gestion/parametrage/type-evenement', type: 'link'},
        {icon: 'i-Arrow-Right', name: 'Évènements', state: '/gestion/parametrage/evenement', type: 'link'},
        {icon: 'i-Arrow-Right', name: 'Statuts', state: '/gestion/parametrage/statut', type: 'link'},
        {icon: 'i-Arrow-Right', name: 'Section', state: '/gestion/parametrage/section', type: 'link'},
        {
          icon: 'i-Arrow-Right',
          name: 'Secteurs d\'activité',
          state: '/gestion/parametrage/secteur-activite',
          type: 'link'
        },
        {icon: 'i-Arrow-Right', name: 'Professions', state: '/gestion/parametrage/profession', type: 'link'},
        {icon: 'i-Arrow-Right', name: 'Fonctions', state: '/gestion/parametrage/secteur', type: 'link'},
        {
          icon: 'i-Arrow-Right',
          name: 'Rôles des auxilliaires',
          state: '/gestion/parametrage/role-auxiliaire',
          type: 'link'
        },
        {icon: 'i-Arrow-Right', name: 'Modèles', state: '/gestion/parametrage/modele', type: 'link'},
        {icon: 'i-Arrow-Right', name: 'Corps juridiques', state: '/gestion/parametrage/corps', type: 'link'},
        {
          icon: 'i-Arrow-Right',
          name: 'Natures juridiques',
          state: '/gestion/parametrage/nature-juridique',
          type: 'link'
        },
        {
          icon: 'i-Arrow-Right',
          name: 'Matières juridiques',
          state: '/gestion/parametrage/matiere-juridique',
          type: 'link'
        },
        {
          icon: 'i-Arrow-Right',
          name: 'Origines de procédure',
          state: '/gestion/parametrage/origine-procedure',
          type: 'link'
        },
      ]
    },
    {
      name: 'Nomenclature',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      type: 'dropDown',
      icon: 'i-Library',
      sub: [
        {icon: 'i-Arrow-Right', name: 'Classifications', state: '/gestion/nomenclature/classification', type: 'link'},
        {
          icon: 'i-Arrow-Right',
          name: 'Natures d\'affaire',
          state: '/gestion/nomenclature/nature-affaire',
          type: 'link'
        },
        {icon: 'i-Arrow-Right', name: 'Nom Affaires Com', state: '/gestion/nomenclature/nac', type: 'link'},
        {icon: 'i-Arrow-Right', name: 'Types de procédure', state: '/gestion/nomenclature/type-procedure', type: 'link'},
       {icon: 'i-Arrow-Right', name: 'Qualifications', state: '/gestion/nomenclature/qualification', type: 'link'},
      ]
    },
    {
      name: 'Org. judiciaire',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      type: 'dropDown',
      icon: 'i-Network-Window',
      sub: [
        {icon: 'i-Arrow-Right', name: 'Salles', state: '/gestion/org-judiciaire/salle', type: 'link'},
        {
          icon: 'i-Arrow-Right',
          name: 'Types de juridiction',
          state: '/gestion/org-judiciaire/type-juridiction',
          type: 'link'
        },
        {
          icon: 'i-Arrow-Right',
          name: 'Services juridiques',
          state: '/gestion/org-judiciaire/service-juridique',
          type: 'link'
        },
        {icon: 'i-Arrow-Right', name: 'Juridictions', state: '/gestion/org-judiciaire/juridiction', type: 'link'},
      ]
    },
    {
      name: 'Personnes',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      type: 'dropDown',
      icon: 'i-Conference',
      sub: [
        {
          icon: 'i-Arrow-Right',
          name: 'Personnes physiques',
          state: '/gestion/personnes/personne-physique',
          type: 'link'
        },
        {icon: 'i-Arrow-Right', name: 'Personnes morales', state: '/gestion/personnes/personne-morale', type: 'link'},
      ]
    },
    {
      name: 'Utilisateurs',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      type: 'dropDown',
      icon: 'i-Business-ManWoman',
      sub: [
        {icon: 'i-Arrow-Right', name: 'Gestion des utilisateurs', state: '/gestion/utilisateur/user', type: 'link'},
        {
          icon: 'i-Arrow-Right',
          name: 'Groupe des utilisateurs',
          state: '/gestion/utilisateur/user-group',
          type: 'link'
        },
      ]
    },
    {
      name: 'Audience',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      type: 'dropDown',
      icon: 'i-Receipt-3',
      sub: [
        {
          icon: 'i-Arrow-Right',
          name: 'Programmation des audiences',
          state: '/gestion/audience/programme-audience',
          type: 'link'
        },
        {
          icon: 'i-Arrow-Right',
          name: 'Gestion des audiences',
          state: '/gestion/audience/calendrier-audience',
          type: 'link'
        },
      ]
    },
    {
      name: 'Dossiers',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      type: 'dropDown',
      icon: 'i-Windows-2',
      sub: [
        {icon: 'i-Folders', name: 'Role général', state: '/gestion/dossier-juridique/role-general', type: 'link'},
        {
          icon: 'i-Add-File',
          name: 'Nouveau dossier',
          state: '/gestion/dossier-juridique/enregistrer-dossier',
          type: 'link'
        },
        {
          icon: 'i-Link-2',
          name: 'Distribuer dossier',
          state: '/gestion/dossier-juridique/distribuer-dossier',
          type: 'link'
        },
        {
          icon: 'i-Link-2',
          name: 'Transferer dossier',
          state: '/gestion/dossier-juridique/transfert-dossier',
          type: 'link'
        }
      ]
    },
    /*  {
          name: 'Others',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
          type: 'dropDown',
          icon: 'i-Double-Tap',
          sub: [
              { icon: 'i-Error-404-Window', name: 'Not found', state: '/others/404', type: 'link' }
          ]
      },*/
    /* {
       name: 'Doc',
       type: 'extLink',
       tooltip: 'Documentation',
       icon: 'i-Safe-Box1',
       state: 'http://demos.ui-lib.com/gull-doc'
     }*/
  ];

  adminMenu: IMenuItem[] = [
    {
      name: 'Dashboard',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      type: 'link',
      icon: 'i-Bar-Chart',
      state: '/gestion/dashboard'
    },
    {
      name: 'Paramétrage',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
      type: 'dropDown',
      icon: 'i-Gear',
      sub: [
        {icon: 'i-Arrow-Right', name: 'Langues', state: '/gestion/parametrage/langue', type: 'link'},
        {icon: 'i-Arrow-Right', name: 'Civilités', state: '/gestion/parametrage/civilite', type: 'link'},
        {icon: 'i-Arrow-Right', name: 'Années', state: '/gestion/parametrage/annee', type: 'link'},
        {icon: 'i-Arrow-Right', name: 'Types d\'évènement', state: '/gestion/parametrage/type-evenement', type: 'link'},
        {icon: 'i-Arrow-Right', name: 'Évènements', state: '/gestion/parametrage/evenement', type: 'link'},
        {icon: 'i-Arrow-Right', name: 'Statuts', state: '/gestion/parametrage/statut', type: 'link'},
        {
          icon: 'i-Arrow-Right',
          name: 'Secteurs d\'activité',
          state: '/gestion/parametrage/secteur-activite',
          type: 'link'
        },
        {icon: 'i-Arrow-Right', name: 'Professions', state: '/gestion/parametrage/profession', type: 'link'},
        {icon: 'i-Arrow-Right', name: 'Fonctions', state: '/gestion/parametrage/secteur', type: 'link'},
        {
          icon: 'i-Arrow-Right',
          name: 'Rôles des auxilliaires',
          state: '/gestion/parametrage/role-auxiliaire',
          type: 'link'
        },
        {icon: 'i-Arrow-Right', name: 'Modèles', state: '/gestion/parametrage/modele', type: 'link'},
        {icon: 'i-Arrow-Right', name: 'Corps juridiques', state: '/gestion/parametrage/corps', type: 'link'},
        {
          icon: 'i-Arrow-Right',
          name: 'Natures juridiques',
          state: '/gestion/parametrage/nature-juridique',
          type: 'link'
        },
        {
          icon: 'i-Arrow-Right',
          name: 'Matières juridiques',
          state: '/gestion/parametrage/matiere-juridique',
          type: 'link'
        },
        {
          icon: 'i-Arrow-Right',
          name: 'Origines de procédure',
          state: '/gestion/parametrage/origine-procedure',
          type: 'link'
        },
      ]
    },
    {
      name: 'Nomenclature',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      type: 'dropDown',
      icon: 'i-Library',
      sub: [
        {icon: 'i-Arrow-Right', name: 'Classifications', state: '/gestion/nomenclature/classification', type: 'link'},
        {
          icon: 'i-Arrow-Right',
          name: 'Natures d\'affaire',
          state: '/gestion/nomenclature/nature-affaire',
          type: 'link'
        },
        {icon: 'i-Arrow-Right', name: 'Nom Affaires Com', state: '/gestion/nomenclature/nac', type: 'link'},
        {icon: 'i-Arrow-Right', name: 'Types de procédure', state: '/gestion/nomenclature/type-procedure', type: 'link'},
        {icon: 'i-Arrow-Right', name: 'Qualifications', state: '/gestion/nomenclature/qualification', type: 'link'},
      ]
    },
  ];

  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.defaultMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  // You can customize this method to supply different menu for
  // different user type.
  // publishNavigationChange(menuType: string) {
  //   switch (userType) {
  //     case 'admin':
  //       this.menuItems.next(this.adminMenu);
  //       break;
  //     case 'user':
  //       this.menuItems.next(this.userMenu);
  //       break;
  //     default:
  //       this.menuItems.next(this.defaultMenu);
  //   }
  // }

  publishNavigationChange(currentUser:User) {
    const currentExerciceFonction = currentUser?.currentExerciceFonction;
    if(currentExerciceFonction!=null) {
      switch (currentExerciceFonction.serviceId) {

      }
    }
    if(currentExerciceFonction?.serviceId>0){
      this.menuItems.next(this.adminMenu);
    } else {
      this.menuItems.next(this.defaultMenu);
    }

  }
}
