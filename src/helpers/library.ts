import Account from "../model/Account";
import cookieServiceInstance from "../service/CookieService";

const profil = (): string => {
    const connectedAccount: Account | null = JSON.parse(cookieServiceInstance.getCookie('connectedAccount')!);
    return connectedAccount ? connectedAccount.username : '';
}

const library = {
    token: 'authToken',
    actualToken: cookieServiceInstance.getCookie('authToken') ?? '',
    account: 'connectedAccount',
    title: 'Students APP',
    deconnection: 'Deconnexion',
    accountList: 'Liste de comptes',
    studentRegister: 'Enregistrement Etudiant',
    dbSweep: 'Vider la base',
    connexion: 'Se connecter',
    register: 'S\'enregistrer',
    role: 'role',
    username: 'username',
    email: 'email',
    studentEdition: 'studentEdition',
    accountEdition: 'accountEdition',
    studentTab: 'student_tab',
    profil: 'profil'
}

export default library;