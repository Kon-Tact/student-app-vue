<template>
  <div class="d-flex justify-content-center">
    <div class="card" style="width: 25rem; margin: 1%">
      <div class="card-body">
        <h5 class="card-title"> {{ titleMessage }}</h5>
        <form @submit.prevent="submitForm(submitChoice)">
          <MDBInput style="margin: 5%;" required v-model="name" label="Nom" type="text"
            invalid-feedback="Le nom est obligatoire" />
          <MDBInput style="margin: 5%;" required v-model="phone_number" label="Numéro de téléphone" type="text"
            invalid-feedback="Le numéro de téléphone est obligatoire" />
          <MDBInput style="margin: 5%;" required v-model="email" label="Email" type="text"
            invalid-feedback="Merci de renseigner votre mail" />
          <MDBInput style="margin: 5%;" required v-model="address" label="Adresse" type="text"
            invalid-feedback="Merci de renseigner votre adresse" />
          <MDBBtn style="margin: 3%;" color="primary" type="submit">{{ btnMessage }}</MDBBtn>
          <MDBBtn style="margin: 3%;" color="primary" type="button" @click="getRando">Test</MDBBtn>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ApiAccess from '@/service/ApiAccess';
import { MDBInput, MDBBtn } from 'mdb-vue-ui-kit';
import cookieServiceInstance from '@/service/CookieService';
import library from '@/helpers/library';
import Student from '@/model/Student';
import { defineProps } from 'vue'
import router from '@/router';
import DataAccess from '@/service/data-access';
import routesNames from '@/helpers/routesNames';

// eslint-disable-next-line no-unused-vars
enum ActionChoice {
  // eslint-disable-next-line no-unused-vars
  Inscription = "INSCRIPTION",
  // eslint-disable-next-line no-unused-vars
  Edition = "EDITION",
  // eslint-disable-next-line no-unused-vars
  Nothing = "NOTHING"
}

const name = ref('');
const phone_number = ref('');
const email = ref('');
const address = ref('');
const btnMessage = ref("");
const titleMessage = ref("");
const idStudent = ref("");
const submitChoice = ref(ActionChoice.Nothing);
let validation: boolean = cookieServiceInstance.getCookie(library.role)!.includes('ADMIN');

const props = defineProps({
  isEditStudent: {
    type: Boolean,
    required: false
  }
})

function submitForm(choice: ActionChoice) {
  switch (choice) {
    case ActionChoice.Inscription: 
      saveStudent();
    break;
    case ActionChoice.Edition:
      editStudent();
    break;
  }
}

async function editStudent() {
  console.log("edit student");
  try {
    let editStudent: Student = new Student(name.value, phone_number.value, email.value, address.value, validation);
    editStudent.id = idStudent.value;
    let studentList: Student[] = JSON.parse(localStorage.getItem(library.studentTab)!);
    await ApiAccess.editStudent(editStudent);
    for (let i = 0; i < studentList.length; i++) {
      studentList[i].id == editStudent.id ? studentList[i] = editStudent : null;
    }
    console.table(studentList);
    localStorage.setItem(library.studentTab, JSON.stringify(studentList));
  } catch (error) {
    console.log(error); 
  } finally {
    router.push(routesNames.home);
  }

}

async function saveStudent() {
  console.log("save student");

  try {
    let studentList: Student[] = JSON.parse(localStorage.getItem(library.studentTab)!);
    const toAddStudent: Student = new Student(name.value, phone_number.value, email.value, address.value, validation) 
    await ApiAccess.saveStudent(toAddStudent).then(response => {
      studentList.push(response);
    });
    console.table(studentList);
    localStorage.setItem(library.studentTab, JSON.stringify(studentList));
  } catch (error) {
    console.log(error);
  } finally {
    router.push(routesNames.home);
  }
}

async function getRando() {
  try {
     const randoStudent: Student = await DataAccess.getRandoDatas();
     console.log(randoStudent);
     name.value = randoStudent.name;
     phone_number.value = randoStudent.phoneNumber;
     address.value = randoStudent.address;
     email.value = randoStudent.email;
  } catch (error) {
    console.log(error);
  }
}

function prepareView() {
  if (props.isEditStudent == false) {
    btnMessage.value = "Inscription";
    titleMessage.value = "Inscription";
    submitChoice.value = ActionChoice.Inscription;
  } else {
    btnMessage.value = "Mettre à jour";
    titleMessage.value = "Mise à jour";
    const editionStudent: Student = JSON.parse(cookieServiceInstance.getCookie(library.studentEdition)!);
    idStudent.value = editionStudent.id;
    name.value = editionStudent.name;
    phone_number.value = editionStudent.phoneNumber;
    address.value = editionStudent.address;
    email.value = editionStudent.email;
    submitChoice.value = ActionChoice.Edition;
  }
}

onMounted(prepareView);
</script>

