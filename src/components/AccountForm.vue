<template>
  <div class="d-flex justify-content-center">
    <div class="card" style="width: 20rem; margin: 1%">
      <div class="card-body">
        <h5 class="card-title"> {{ titleMessage }}</h5>
        <form @submit.prevent="defineSubmit(FormCase)">
          <MDBInput style="margin: 5%;" required v-model="username" label="Nom d'utilisateur" type="text"
            invalid-feedback="Le nom d'utilisateur est obligatoire" />
          <MDBInput v-if="!props.isEditAccount" style="margin: 5%;" required v-model="password" label="Mot de passe"
            type="password" invalid-feedback="Le mot de passe est obligatoire" />
          <MDBInput v-if="!props.isLogin" style="margin: 5%;" required v-model="email" label="Email" type="email"
            invalid-feedback="Merci de renseigner votre mail" />
          <div v-if="props.isEditAccount"
            style="display: flex; justify-content: center; align-items: center; margin: 3%;">
            <MDBCheckbox label="Administrateur" v-model="isAdmin" />
          </div>
          <MDBBtn style="margin: 3%;" color="primary" type="submit">{{ btnMessage }}</MDBBtn>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ApiAccess from '@/service/ApiAccess';
import ConnectManager from '@/service/Connexion';
import { MDBInput, MDBCheckbox, MDBBtn } from 'mdb-vue-ui-kit';
import AccountResponse from '@/model/AccountResponse';
import Credential from '@/model/Credential';
import { defineProps } from 'vue'
import router from '@/router';
import { isAdministrator, isAuthenticated, connectedUsername } from '@/helpers/authState';
import routesNames from '@/helpers/routesNames';
import cookieServiceInstance from '@/service/CookieService';
import library from '@/helpers/library';
import Account from '@/model/Account';

// eslint-disable-next-line no-unused-vars
enum FormType {
  // eslint-disable-next-line no-unused-vars
  Login = "LOGIN",
  // eslint-disable-next-line no-unused-vars
  Register = "REGISTER",
  // eslint-disable-next-line no-unused-vars
  EditProfil = "EDITPROFIL",
  // eslint-disable-next-line no-unused-vars
  EditAccount = "EDITACCOUNT",
  // eslint-disable-next-line no-unused-vars
  Nothing = "NOTHING"
}

const isAdmin = ref(false);
const username = ref('');
const password = ref('');
const email = ref('');
const id = ref('');
const FormCase = ref(FormType.Nothing);
let btnMessage = ref("");
let titleMessage = ref("");
let errorCase: boolean = false;

const props = defineProps({
  isRegister: {
    type: Boolean,
    required: false
  },
  isEditAccount: {
    type: Boolean,
    required: false
  },
  isLogin: {
    type: Boolean,
    required: false
  },
  isProfilEdit: {
    type: Boolean,
    required: false
  }
});

function defineSubmit(choice: FormType) {
  switch (choice) {
    case FormType.Login:
      connexion();
      break;
    case FormType.Register:
      saveAccount();
      break;
    case FormType.EditAccount:
    case FormType.EditProfil:
      editAccount();
      break;
  }
}

async function connexion() {
  console.log("connexion");
  try {
    console.log(username.value);
    console.log(password.value);
    await ApiAccess.login(new Credential(username.value, password.value)).then(response => {
      if (response.token.length > 0) {
        ConnectManager.connection(response);
        localStorage.setItem(library.profil, username.value);
        console.log("The username is " + localStorage.getItem(library.profil));
        connectedUsername.value = username.value;
        console.log(response.account.role);
        console.log(response.account.role.includes('ADMIN'));
        isAuthenticated.value = true;
        isAdministrator.value = response.account.role.includes('ADMIN') ? true : false;
        errorCase = false;
      } else {
        errorCase = true;
        console.log("Error");
      }
    });

  } catch (error) {
    console.log(error);
  } finally {
    if (errorCase  == false) {
      router.push(routesNames.home);
    }
  }
}

async function saveAccount() {
  console.log("save account");
  try {
    await ApiAccess.saveAccount(new Account(username.value, password.value, email.value)).then(responseAPI => {
      if(responseAPI.account.id.length > 0) {
      if (localStorage.getItem(library.accountList)) {
        const response: AccountResponse = responseAPI;
        let accountList: Account[] = JSON.parse(localStorage.getItem(library.accountList)!);
        const newaccount = new Account(response.account.username, '', response.account.email, response.account.role);
        newaccount.id = response.account.id;
        accountList.push(newaccount);
        localStorage.setItem(library.accountList, JSON.stringify(accountList));
        ConnectManager.connection(response);
        localStorage.setItem(library.profil, username.value);
        connectedUsername.value = username.value;
        isAuthenticated.value = true;
        isAdministrator.value = response.account.role.includes('ADMIN') ? true : false;
        errorCase = false;
      }
      } else {
        errorCase = true;
      }
    });
  } catch (error) {
    console.log(error);
  } finally {
    if(errorCase == false) {
      router.push(routesNames.home);
    }  
  }
}

async function editAccount() {
  console.log("edit account");
  try {
    const role: string = isAdmin.value ? 'ADMIN' : 'USER';
    let editAccount: Account = new Account(username.value, password.value, email.value, role);
    editAccount.id = id.value;
    await ApiAccess.editAccount(editAccount).then(editedAccount => {
      console.log(editedAccount);
      if (editedAccount.account.id != null) {
        console.log(editedAccount);
        let editedAccountEmptyPass: Account = editedAccount.account;
        editedAccountEmptyPass.password = '';
        console.log(JSON.parse(localStorage.getItem(library.accountList)!));
        if (localStorage.getItem(library.accountList)) {
          let accountList: Account[] = JSON.parse(localStorage.getItem(library.accountList)!);
          const newAccountList: Account[] = accountList.map(account => account.id == editedAccountEmptyPass.id ? editedAccountEmptyPass : account);
          console.log(accountList);
          console.log(newAccountList);
          localStorage.setItem(library.accountList, JSON.stringify(newAccountList));
          errorCase = false;
        }
      } else {
        errorCase = true;
      } 
    });
    
  } catch (error) {
    console.log(error);
  } finally {
    if(errorCase == false) {
      router.push(routesNames.accounts);
    }
  }
}

function manageDisplayedDatas() {
  switch (FormCase.value) {
    case FormType.Register:
      btnMessage.value = "S'enregistrer";
      titleMessage.value = "Enregistrement";
      break;
    case FormType.EditAccount:
      btnMessage.value = "Mettre à jour";
      titleMessage.value = "Mise à jour";
      if (cookieServiceInstance.getCookie(library.accountEdition)) {
        const toEditAccount: Account = JSON.parse(cookieServiceInstance.getCookie(library.accountEdition)!);
        id.value = toEditAccount.id;
        username.value = toEditAccount.username;
        email.value = toEditAccount.email;
        isAdmin.value = toEditAccount.role.includes('ADMIN');
      } else {
        router.push(routesNames.accounts);
      }
      break;
    case FormType.Login:
      btnMessage.value = "Se connecter";
      titleMessage.value = "Connexion";
      break;
    case FormType.EditProfil:
      btnMessage.value = "Edition du profil";
      titleMessage.value = "Edition";
      if (cookieServiceInstance.getCookie(library.account)) {
        const connectedAccount: Account = JSON.parse(cookieServiceInstance.getCookie(library.account)!);
        id.value = connectedAccount.id;
        username.value = connectedAccount.username;
        email.value = connectedAccount.email;
        isAdmin.value = connectedAccount.role.includes('ADMIN');
      } else {
        router.push(routesNames.connexion);
      }
      break;
  }
}

function defineFormCase() {
  if (props.isRegister == true) {
    console.log("Register form");
    FormCase.value = FormType.Register;
  } else if (props.isEditAccount == true) {
    FormCase.value = FormType.EditAccount;
    console.log("Edit account form");
  } else if (props.isLogin == true) {
    FormCase.value = FormType.Login;
    console.log("Connexion form");
  } else if (props.isProfilEdit == true) {
    FormCase.value = FormType.EditProfil;
    console.log("Edit profil form");

  }

  manageDisplayedDatas()
}

onMounted(defineFormCase);
</script>