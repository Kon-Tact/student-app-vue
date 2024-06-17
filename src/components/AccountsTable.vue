<template>
    <div :style="{ display: 'flex', justifyContent: 'center' }">
        <table class="table adapt">
            <thead>
                <tr>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(account, index) in accounts" :key="account.id" :hidden="account.id == connectedId">
                    <td>{{ account.username }}</td>
                    <td>{{ account.email }}</td>
                    <td :style="{ display: 'flex', justifyContent: 'center' }">
                        <MDBCheckbox label="Administrateur" :disabled="isSuperAdmin(account)"
                            v-model="checkboxRefTab[index]" @click="openModal(ModalType.ChangeRole, index, account)" />
                    </td>
                    <td>
                        <a v-if="!isSuperAdmin(account)" style="color: #3b5998;" href="#!" role="button">
                            <i class="fas fa-pen" @click="openModal(ModalType.EditAccount, index, account)"></i>
                        </a>
                        <a v-if="!isSuperAdmin(account)" style="color: #3b5998;" href="#!" role="button">
                            <i class="fas fa-user-xmark"
                                @click="openModal(ModalType.DeleteAccount, index, account)"></i>
                        </a>
                    </td>
                    <!-- v-if="isConnectedAccount(account)" -->
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
            <MDBBtn color="secondary" @click="onNoModal(onYesType)">Annuler</MDBBtn>
            <MDBBtn color="primary" @click="onYesModal(onYesType)">Confirmer</MDBBtn>
        </MDBModalFooter>
    </MDBModal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiAccess from '@/service/ApiAccess';
import library from '@/helpers/library';
import {
    MDBCheckbox,
    MDBModal,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBBtn,
} from "mdb-vue-ui-kit";
import Account from '@/model/Account';
import cookieServiceInstance from '@/service/CookieService';
import router from '@/router';
import routesNames from '@/helpers/routesNames';

// eslint-disable-next-line no-unused-vars
enum ModalType {
    // eslint-disable-next-line no-unused-vars
    EditAccount = "EDITACCOUNT",
    // eslint-disable-next-line no-unused-vars
    DeleteAccount = "DELETEACCOUNT",
    // eslint-disable-next-line no-unused-vars
    ChangeRole = "CHANGEROLE",
    // eslint-disable-next-line no-unused-vars
    Nothing = "NOTHING"
}

const accounts = ref();
const checkboxRefTab = ref();
const modal = ref(false);
const modalHeader = ref('');
const modalBodyFirstLine = ref('');
const modalBodySecondLine = ref('');
const onYesType = ref(ModalType.Nothing);
const accountRef = ref();
const actualIndex = ref();
const connectedId = ref('');


const defineData = () => {
    if (localStorage.getItem(library.accountList)) {
        const accountTab: Account[] = JSON.parse(localStorage.getItem(library.accountList)!);
        if (accountTab.length > 0) {
            console.log(accountTab);
            const booleanTab: boolean[] = new Array();
            for (let i = 0; i < accountTab.length; i++) {
                booleanTab[i] = accountTab[i].role.includes('ADMIN') ? true : false;
            }
            console.log(booleanTab);
            checkboxRefTab.value = [...booleanTab];
            accounts.value = JSON.parse(localStorage.getItem(library.accountList)!);
        } else {
            fetchAccounts();
        }
    } else {
        fetchAccounts();
    }
    if (cookieServiceInstance.getCookie(library.account)) {
        const connectedAccount: Account = JSON.parse(cookieServiceInstance.getCookie(library.account)!);
        connectedId.value = connectedAccount.id;
    }
}

const isSuperAdmin = (account: Account) => {
    if (account.role == "SUPER_ADMIN") {
        return true;
    } else {
        return false;
    }
}

const fetchAccounts = () => {
    ApiAccess.getAccountList()
        .then(response => {
            localStorage.setItem(library.accountList, JSON.stringify(response));
            accounts.value = response;
            console.log(accounts.value);
        })
        .catch(error => {
            console.error(error);
        }
        );
};

function openModal(choice: ModalType, index: number, account: Account) {
    switch (choice) {
        case ModalType.ChangeRole:
            modal.value = true;
            modalHeader.value = "Changement de role";
            modalBodyFirstLine.value = `Vous allez changer le role du compte ${account.username}.`;
            modalBodySecondLine.value = "Souhaitez-vous continuer ?";
            accountRef.value = account;
            onYesType.value = ModalType.ChangeRole;
            actualIndex.value = index;
            break;
        case ModalType.DeleteAccount:
            modal.value = true;
            modalHeader.value = "Suppression du compte";
            modalBodyFirstLine.value = `Vous allez supprimer le compte ${account.username} de la base de donnée.`;
            modalBodySecondLine.value = "Cette action est irréversible. Voulez vous continuer ?";
            accountRef.value = account;
            onYesType.value = ModalType.DeleteAccount
            break;
        case ModalType.EditAccount:
            modal.value = true;
            modalHeader.value = "Edition";
            modalBodyFirstLine.value = `Vous allez entrer dans l'édition du compte ${account.username}.`;
            modalBodySecondLine.value = "Souhaitez vous continuer ?"
            accountRef.value = account;
            onYesType.value = ModalType.EditAccount;
            break;
        case ModalType.Nothing:
            break;
    }
}

function onYesModal(choice: ModalType) {
    switch (choice) {
        case ModalType.ChangeRole:
            modal.value = false;
            changeRole();
            break;
        case ModalType.DeleteAccount:
            modal.value = false;
            deleteAccount();
            break;
        case ModalType.EditAccount:
            modal.value = false;
            toEdition();
            break;
        case ModalType.Nothing:
            break;
    }
}

function onNoModal(choice: ModalType) {
    if (choice == ModalType.ChangeRole) {
        modal.value = false;
        const modifiedState: boolean = checkboxRefTab.value[actualIndex.value];
        if (modifiedState) {
            checkboxRefTab.value[actualIndex.value] = false;
        } else {
            checkboxRefTab.value[actualIndex.value] = true;
        }
    } else {
        modal.value = false;
    }
}

function toEdition() {
    cookieServiceInstance.setCookie(library.accountEdition, JSON.stringify(accountRef.value), 2);
    router.push(routesNames.editaccount);
}

async function changeRole() {

    try {
        await ApiAccess.changeRole(accountRef.value)
            .then(response => {
                console.log(response);
                localRoleChange();
            });
    } catch (error) {
        console.log(error);
    }
}

async function deleteAccount() {
    try {
        await ApiAccess.deleteAccount(accountRef.value).then(response => {
            console.log(response);
            const accountTab: Account[] = accounts.value;
            const deletedAccount: Account = accountRef.value;
            const newAccountList = accountTab.filter(a => a.id !== deletedAccount.id);
            accounts.value = newAccountList;
            localStorage.setItem(library.accountList, JSON.stringify(newAccountList))
        })
    } catch (error) {
        console.log(error);
    }
}

function localRoleChange() {
    const accountTab: Account[] = JSON.parse(localStorage.getItem(library.accountList)!);
    const modifiedRoleAccount: Account = accountRef.value;
    for (let i = 0; i < accountTab.length; i++) {
        if (accountTab[i].id == modifiedRoleAccount.id) {
            if (accountTab[i].role == "ADMIN") {
                accountTab[i].role = "USER";
            } else {
                accountTab[i].role = "ADMIN";
            }
        }
    }
    localStorage.setItem(library.accountList, JSON.stringify(accountTab));
    accounts.value = accountTab;
}

onMounted(defineData);
</script>
