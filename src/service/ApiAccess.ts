import API_ENDPOINTS from "@/config/api-config";
import Account from "@/model/Account";
import AccountResponse from "@/model/AccountResponse";
import Credential from "@/model/Credential";
import Student from "@/model/Student";
import cookieServiceInstance from "./CookieService";
import library from "@/helpers/library";

export default class ApiAccess {

    static token: string | null = cookieServiceInstance.getCookie(library.token) ? cookieServiceInstance.getCookie(library.token) : null;

    static getStudents(): Promise<Student[]> {
        return fetch(API_ENDPOINTS.studentList)
            .then(response => {
                return response.json()
            })
            .catch(error => {
                console.error('Error fetching students:', error);
                return [];
            });
    }

    static login(credentials: Credential): Promise<AccountResponse> {
        return fetch(API_ENDPOINTS.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(credentials),
            mode: 'cors'
        })
            .then(response =>  {
                return response.json();
            })
            .catch(error => {
                console.error(error);
                return [] as any;
            });
    }

    static getAccounts(): Promise<Account[]> {
        return fetch(API_ENDPOINTS.accountList)
            .then(response => {
                return response.json()
            })
            .catch(error => {
                console.error('Error fetching accounts:', error);

                return [];
            });
    }

    static saveStudent(student: Student): Promise<Student> {
        return fetch(API_ENDPOINTS.saveStudent, {
            method: 'POST',
            body: JSON.stringify(student),
            headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
             },
            
        })
            .then(response => {
                return response.json()
            })
            .catch(error => {
                console.error('Error whe save students:', error);
                return [];
            });
    }

    static logout(): Promise<null> {

        return fetch(API_ENDPOINTS.logout, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
            .then(response => {
                cookieServiceInstance.removeCookie(library.account);
                cookieServiceInstance.removeCookie(library.token);
                return response.json();
            })
            .catch(error => console.error(error));
    }

    static clearBase(): Promise<null> {

        return fetch(API_ENDPOINTS.clearBase, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
            .then(response => response.json())
            .catch(error => console.error(error));
    }

    static deleteStudent(student: Student): Promise<null> {

        return fetch(API_ENDPOINTS.deleteStudent + student.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
            .then(reponse => reponse.json())
            .catch(error => console.error(error));
    }

    static getAccountList(): Promise<Account[]> {

        return fetch(API_ENDPOINTS.accountList, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
            .then(response => {
                return response.json();
            })
            .then(data => {

                console.log(data);
                
                // Map the data to include only the required fields
                return data.map((accountData: { id: string; username: string; email: string; role: string; }) => {
                    const { id, username, email, role } = accountData;
                    const account: Account = new Account(username, '', email, role);
                    account.id = id;
                    console.log(account);
                    return account;
                });
            })
            .catch(error => {
                console.error(error);
                return []; // Return empty array in case of error
            });
    }


    static saveAccount(credentials: Credential): Promise<AccountResponse> {
        return fetch(API_ENDPOINTS.saveAccount, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .catch(error => console.error(error));
    }

    static editAccount(account: Account): Promise<AccountResponse> {

        return fetch(API_ENDPOINTS.editAccount, {
            method: 'PUT',
            body: JSON.stringify(account),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
            .then(response => response.json())
            .catch(error => console.error(error));
    }

    static deleteAccount(account: Account): Promise<null> {
        return fetch(API_ENDPOINTS.deleteAccount + account.id, {
            method: 'DELETE',
            body: JSON.stringify(account),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
            .then(response => response.json())
            .catch(error => console.error(error));
    }

    static changeRole(account: Account): Promise<string> {

        const idRole:string[] = new Array();
        idRole.push(account.id);
        idRole.push(account.role);

        return fetch(API_ENDPOINTS.changeRole, {
            method: 'POST',
            body: JSON.stringify(idRole),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
            .then(response => response.json())
            .catch(error => console.error(error));
    }

    static editStudent(student: Student): Promise<Student> {

        return fetch(API_ENDPOINTS.editStudent, {
            method: 'PUT',
            body: JSON.stringify(student),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })

            .then(response => response.json())
            .catch(error => console.error(error));
    }

    static validate(student: Student): Promise<Student> {
        return fetch(API_ENDPOINTS.validate + student.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        })
            .then(response => {
                return response.json()
            })
            .catch(error => {
                console.error(error);

            });
    }
}