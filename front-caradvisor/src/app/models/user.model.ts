export class User {

    constructor(
        public name?: string,
        public surname?: string,
        public nick?: string,
        public phone?: string,
        public email?: string,
        public password?: string,
        public img?: string,
        public google?: boolean,
        public role?: 'ADMIN_ROLE' | 'USER_ROLE',
        public uid?: string,
    ) {}

}