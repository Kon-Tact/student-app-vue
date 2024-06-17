<template>
  <MDBNavbar expand="sm" dark bg="primary" container class="ehoh">
    <MDBNavbarNav class="mb-lg-0" >
      <MDBNavbarItem v-if="isAuthenticated" href="#" active>
        <router-link to="/addstudent" class="nav-link ">
          <span class="hide">Enregistrement</span>
          <i class="fas fa-plus-square"></i>
        </router-link>
      </MDBNavbarItem>
      <MDBNavbarItem href="#" active @click="openModal(ModalType.BaseSweep)" v-if="isAdministrator" class="centerhv">
        <div class="centerFlex">
        <span class="hide">Vidage</span>
        <i class="fas fa-eraser"></i>
        </div>
      </MDBNavbarItem>
      <MDBNavbarItem v-if="isAuthenticated" href="#" active @click="resync()">
        <i class="fas fa-sync down"></i>
      </MDBNavbarItem>
    </MDBNavbarNav>
    <MDBNavbarNav center class="mb-lg-0">
      <MDBNavbarBrand href="#" active>
        <router-link to="/" class="nav-link">
          <span class="hidePhone">Students APP</span>
        </router-link>
      </MDBNavbarBrand>
    </MDBNavbarNav>
    <MDBNavbarNav v-if="isAuthenticated" right class="mb-lg-0">
      <MDBNavbarItem v-if="isAdministrator" href="#" active>
        <router-link to="/account/list" class="nav-link ">
          <i class="fas fa-list-ul"></i>
          <span class="hide">Comptes</span>
        </router-link>
      </MDBNavbarItem>
      <MDBNavbarItem href="#" active>
        <router-link to="/profil" class="nav-link ">
          <i class="fas fa-edit"></i>
          <span class="hide">{{connectedUsername}}</span>
        </router-link>
      </MDBNavbarItem>
      <MDBNavbarItem href="#" active @click="openModal(ModalType.Deconnexion)" class="centerhv">
        <div class="centerFlex">
          <i class="fas fa-sign-in-alt"></i>
          <span class="hide">Deconnexion</span>
        </div>
      </MDBNavbarItem>
    </MDBNavbarNav>
    <MDBNavbarNav v-if="!isAuthenticated" right class="mb-lg-0">
      <MDBNavbarItem href="#" active>
        <router-link to="/connection" class="nav-link " :style="{ color: 'white', display: 'flex', alignItems: 'center' }">
          <i class="fas fa-sign-in-alt"></i>
          <span class="hide">Connexion</span>
        </router-link>
      </MDBNavbarItem>
      <MDBNavbarItem href="#" active>
        <router-link to="/register" class="nav-link " :style="{ color: 'white', display: 'flex', alignItems: 'center' }">
          <i class="fas fa-plus"></i>
          <span class="hide">S'enregistrer</span>
        </router-link>
      </MDBNavbarItem>
    </MDBNavbarNav>
  </MDBNavbar>

  <MDBModal id="modal" tabindex="-1" labelledby="modalLabel" v-model="modal">
    <MDBModalHeader>
      <MDBModalTitle id="modalLabel">{{ modalHeader }}</MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody>
      <p>{{ modalBodyFirstLine }}</p>
      <p>{{ modalBodySecondLine }}</p>
    </MDBModalBody>
    <MDBModalFooter>
      <MDBBtn color="secondary" @click="modal = false">Annuler</MDBBtn>
      <MDBBtn color="primary" @click="onYesModal(onYesType)">Confirmer</MDBBtn>
    </MDBModalFooter>
  </MDBModal>

</template>

<script setup lang="ts">
import { isAdministrator, isAuthenticated, connectedUsername } from '@/helpers/authState';
import library from '@/helpers/library';
import routesNames from '@/helpers/routesNames';
import router from '@/router';
import ApiAccess from '@/service/ApiAccess';
import ConnectManager from '@/service/Connexion';
import {
  MDBNavbar,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarBrand,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
} from 'mdb-vue-ui-kit';
import { ref } from 'vue';

// eslint-disable-next-line no-unused-vars
enum ModalType {
  // eslint-disable-next-line no-unused-vars
  Deconnexion = "DECONNEXION",
  // eslint-disable-next-line no-unused-vars
  BaseSweep = "BASESWEEP",
  // eslint-disable-next-line no-unused-vars
  Nothing = "NOTHING"
}

const modal = ref(false);
const modalHeader = ref('');
const modalBodyFirstLine = ref('');
const modalBodySecondLine = ref('');
const onYesType = ref(ModalType.Nothing);

function openModal(choice: ModalType) {
  switch (choice) {
    case ModalType.Deconnexion:
      modal.value = true;
      modalHeader.value = "Deconnexion";
      modalBodyFirstLine.value = "Vous allez vous déconnecter."
      modalBodySecondLine.value = "Êtes vous certains de vouloir continuer ?"
      onYesType.value = ModalType.Deconnexion;
      break;
    case ModalType.BaseSweep:
      modal.value = true;
      modalHeader.value = "Supprimer tout les élèves";
      modalBodyFirstLine.value = "Vous allez vider la base de donnée."
      modalBodySecondLine.value = "Cette action est irréversible. Voulez vous continuer ?";
      onYesType.value = ModalType.BaseSweep
      break;
    case ModalType.Nothing:
      break;
  }
}

function onYesModal(choice: ModalType) {
  switch (choice) {
    case ModalType.Deconnexion:
      modal.value = false;
      disconnect();
      break;
    case ModalType.BaseSweep:
      modal.value = false;
      sweepingBase();
      break;
    case ModalType.Nothing:
      break;
  }
}

function disconnect() {
  try {
    ConnectManager.deconnection();
  } catch (error) {
    console.log(error);
  } finally {
    router.push(routesNames.connexion);
  }
}

async function sweepingBase() {
  try {
    await ApiAccess.clearBase();
  } catch (error) {
    console.log(error);
  }
}

async function resync() {
  try {
    await ApiAccess.getStudents()
      .then(response => {
        console.log(response);
        localStorage.setItem(library.studentTab, JSON.stringify(response));
      });
    await ApiAccess.getAccountList()
      .then(response => {
        console.log(response);
        localStorage.setItem(library.accountList, JSON.stringify(response));
      })
  } catch (error) {
    console.log(error);
  } finally {
    window.location.reload();
  }
}

</script>