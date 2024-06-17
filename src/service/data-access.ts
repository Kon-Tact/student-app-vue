import Student from "@/model/Student";

export default class DataAccess {


    static getRandoDatas(): Promise<Student> {
        return fetch('/test_datas.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then(data => {
                const fnList: string[] = data.firstnames;
                const lnList: string[] = data.lastnames;
                const snList: string[] = data.streetnames;

                const randoStud = new Student();

                const lastname = this.listRand(lnList);
                const firstname = this.listRand(fnList);
                randoStud.name = lastname + " " + firstname;
                randoStud.address = Math.floor(Math.random() * 30) + " " + this.listRand(snList);
                randoStud.phoneNumber = this.generateNumber();
                randoStud.email = lastname.toLowerCase() + "." + firstname.toLowerCase() + "@email.com";

                return randoStud;
            })
    }

    private static listRand(list: string[]): string {
        const randIndex = Math.floor(Math.random() * list.length);
        const randElement = list[randIndex];
        return randElement;
    }

    private static generateNumber(): string {

        let phoneNumber: string = "0";

        const possibleValues = [6, 7];
        const randomIndex = Math.floor(Math.random() * possibleValues.length);
        phoneNumber += possibleValues[randomIndex];

        for (let i = 0; i < 8; i++) {
            phoneNumber += Math.floor(Math.random() * 10);
        }

        console.log(phoneNumber);
        return phoneNumber;
    }
}