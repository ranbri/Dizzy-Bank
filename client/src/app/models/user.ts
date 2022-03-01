export class User {
    public constructor(
        public _id?: string,
        public email?: string,
        public firstName?: string,
        public lastName?: string,
        public password?: string,
        public phone?: string,
        public city?: string,
        public street?: string,
        public zipcode?: number,
        public house?: number,
        public entrance?: string,
        public floor?: number,
        public apartment?: number,
        public loggedIn?: boolean,
        public isAdmin?: boolean,
        public balance?: number,
        public dateOfBirth?:any,
        public accountNumber?:string
    ) {
    }
}