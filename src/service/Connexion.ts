import { isAdministrator, isAuthenticated } from "@/helpers/authState";
import library from "../helpers/library";
import AccountResponse from "../model/AccountResponse";
import cookieServiceInstance from "./CookieService";

export default class ConnectManager {

    static username: string = '';

    static connection(response: AccountResponse) {
        cookieServiceInstance.setCookie(library.account, JSON.stringify(response.account), 2);
        cookieServiceInstance.setCookie(library.token, response.token, 2);
        cookieServiceInstance.setCookie(library.role, response.account.role, 2);
        console.log(cookieServiceInstance.getCookie(library.account));
        console.log(cookieServiceInstance.getCookie(library.token));
        console.log(cookieServiceInstance.getCookie(library.role));
    }

    static deconnection() {
        cookieServiceInstance.removeCookie(library.account);
        cookieServiceInstance.removeCookie(library.token);
        cookieServiceInstance.removeCookie(library.role);
        isAdministrator.value = false;
        isAuthenticated.value = false;
        localStorage.setItem(library.profil, '');
    }
}