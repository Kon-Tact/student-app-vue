<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Phone Number</th>
          <th scope="col">Email</th>
          <th scope="col">Address</th>
          <th scope="col">Validated</th>
          <th v-if="isAdmin" scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td>{{ student.name }}</td>
          <td>{{ student.phoneNumber }}</td>
          <td>{{ student.email }}</td>
          <td>{{ student.address }}</td>
          <td>{{ student.validated ? 'Yes' : 'No' }}</td>
          <td v-if="isAdmin">
            <a style="color: #3b5998;" href="#!" role="button">
              <i class="fas fa-pen" @click="openModal(ModalType.EditStudent, student)"></i>
            </a>
            <a style="color: #3b5998;" href="#!" role="button">
              <i class="fas fa-user-xmark" @click="openModal(ModalType.DeleteStudent, student)"></i>
            </a>
            <a style="color: #3b5998;" href="#!" role="button" @click="openModal(ModalType.Validate, student)" v-if="!student.validated">
              <i class="fas fa-check"></i>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

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
import { ref, computed, onMounted } from 'vue';
import ApiAccess from '@/service/ApiAccess';
import cookieServiceInstance from '@/service/CookieService';
import library from '@/helpers/library';
import {
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
} from 'mdb-vue-ui-kit';
import Student from '@/model/Student';
import router from '@/router';
import routesNames from '@/helpers/routesNames';

// eslint-disable-next-line no-unused-vars
enum ModalType {
  // eslint-disable-next-line no-unused-vars
  EditStudent = "EDITSTUDENT",
  // eslint-disable-next-line no-unused-vars
  DeleteStudent = "DELETSTUDENT",
  // eslint-disable-next-line no-unused-vars
  Validate = "VALIDATE",
  // eslint-disable-next-line no-unused-vars
  Nothing = "NOTHING"
}

const modal = ref(false);
const modalHeader = ref('');
const modalBodyFirstLine = ref('');
const modalBodySecondLine = ref('');
const onYesType = ref(ModalType.Nothing);
const students = ref();
const studentRef = ref();

const checkConnexion = () => {
  console.log("check connexion");
  if(cookieServiceInstance.getCookie(library.account)) {
    console.log("A user is logged");
    defineData();
  } else {
    console.log("Redirecting in the connexion page");
    router.push(routesNames.connexion);
  }
}

const defineData = () => {
  console.log("define data");
  if (localStorage.getItem(library.studentTab)) {
    const studentList: Student[] = JSON.parse(localStorage.getItem(library.studentTab!)!);
    if(studentList.length > 0) {
      console.log("Using cache data");
      students.value = studentList;
    } else {
      fetchStudents();
    }
    console.log(studentList);
  } else {
    fetchStudents();
  }
}

const fetchStudents = () => {
  console.log("fetchStudents()");
  ApiAccess.getStudents()
    .then(response => {
      localStorage.setItem(library.studentTab, JSON.stringify(response));
      students.value = response;
      console.log(students.value);
    })
    .catch(error => {
      console.error('There was an error fetching the student data!', error);
    });
}

function openModal(choice: ModalType, student: Student) {
  switch (choice) {
    case ModalType.EditStudent:
      modal.value = true;
      modalHeader.value = "Edition d'étudiants";
      modalBodyFirstLine.value = `Vous allez entrez dans l'édition de ${student.name}.`;
      modalBodySecondLine.value = "Souhaitez-vous continuer ?";
      studentRef.value = student;
      onYesType.value = ModalType.EditStudent;
      break;
    case ModalType.DeleteStudent:
      modal.value = true;
      modalHeader.value = "Suppression de l'élève";
      modalBodyFirstLine.value = `Vous allez supprimer l'élève ${student.name} de la base de donnée.`;
      modalBodySecondLine.value = "Cette action est irréversible. Voulez vous continuer ?";
      studentRef.value = student;
      onYesType.value = ModalType.DeleteStudent
      break;
    case ModalType.Validate: 
      modal.value = true;
      modalHeader.value = "Validation";
      modalBodyFirstLine.value = `Vous allez valider l'élève ${student.name}.`;
      modalBodySecondLine.value = "Souhaitez vous continuer ?"
      studentRef.value = student;
      onYesType.value = ModalType.Validate;
      break;
    case ModalType.Nothing:
      break;
  }
}

function onYesModal(choice: ModalType) {
  switch (choice) {
    case ModalType.EditStudent:
      modal.value = false;
      toEdition();
      break;
    case ModalType.DeleteStudent:
      modal.value = false;
      deleteStudent();
      break;
    case ModalType.Validate:
      modal.value = false;
      validateStudent();
      break;
    case ModalType.Nothing:
      break;
  }
}

function toEdition() {
  cookieServiceInstance.setCookie(library.studentEdition, JSON.stringify(studentRef.value), 2);
  router.push(routesNames.editstudent);
}

async function deleteStudent() {
  try {
    await ApiAccess.deleteStudent(studentRef.value).then(response => {
      console.log(response);
      let studentList: Student[] = students.value;
      const deletedStudent: Student = studentRef.value;
      const newStudentList = studentList.filter(s => s.id !== deletedStudent.id);
      localStorage.setItem(library.studentTab, JSON.stringify(newStudentList));
      console.table(newStudentList);
      studentRef.value = newStudentList;
    });
  } catch (error) {
    console.log(error);
  }
}

async function validateStudent() {
  try {
    await ApiAccess.validate(studentRef.value);
  } catch (error) {
    console.log(error);  
  } finally {
    let studentList: Student[] = students.value;
    const validateStudent: Student = studentRef.value;
    for (let i = 0; i < studentList.length; i++) {
      studentList[i].id == validateStudent.id ? studentList[i].validated = true : null;
    }
    localStorage.setItem(library.studentTab, JSON.stringify(studentList));
    console.table(studentList);
    studentRef.value = studentList;
  }
}

const isAdmin = computed(() => {
  const accountCookie = cookieServiceInstance.getCookie(library.account);
  const roleCookie = cookieServiceInstance.getCookie(library.role);
  return accountCookie && roleCookie && roleCookie.includes("ADMIN");
});

onMounted(checkConnexion);
</script>

<style>
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.table th {
  background-color: #f2f2f2;
}

.fas {
  margin-inline-start: 8%;
  margin-inline-end: 8%;
}
</style>