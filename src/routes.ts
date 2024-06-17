import { RouteRecordRaw } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import RegisterView from '@/views/RegisterView.vue';
import StudentRegister from '@/views/StudentRegister.vue';
import routesNames from './helpers/routesNames';
import EditStudentView from '@/views/EditStudentView.vue';
import AccountsList from '@/views/AccountsList.vue';
import AccountEdition from '@/views/AccountEdition.vue';
import ProfilView from '@/views/ProfilView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: routesNames.home,
    name: 'Home',
    component: HomeView
  },
  {
    path: routesNames.connexion,
    name: 'Connexion',
    component: LoginView
  },
  {
    path: routesNames.register,
    name: 'Register',
    component: RegisterView
  },
  {
    path: routesNames.addstudent,
    name: 'AddStudent',
    component: StudentRegister
  },
  {
    path: routesNames.editstudent,
    name: 'EditStudent',
    component: EditStudentView
  },
  {
    path: routesNames.accounts,
    name: 'Accounts',
    component: AccountsList
  },
  {
    path: routesNames.profil,
    name: 'EditProfil',
    component: ProfilView
  },
  {
    path: routesNames.editaccount,
    name: 'EditAccount',
    component: AccountEdition
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Home',
    component: HomeView
  },
  
];

export default routes;
