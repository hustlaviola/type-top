import shortid from 'shortid';
import debug from 'debug';

import { CreateUserDto } from '../dtos/create.user.dto';
import { PatchUserDto } from '../dtos/patch.user.dto';
import { PutUserDto } from '../dtos/put.user.dto';

const log: debug.IDebugger = debug('app:in-memory-dao');

class UsersDao {
    users: Array<CreateUserDto> = [];

    constructor() {
        log('Created new instance of UsersDao');
    }

    async addUser(user: CreateUserDto): Promise<string> {
        user.id = shortid.generate();
        this.users.push(user);
        return user.id;
    }

    async getUsers() {
        return this.users;
    }

    async getUser(id: string) {
        return this.users.find((user: CreateUserDto) => user.id === id);
    }

    async putUserById(id: string, user: PutUserDto) {
        const index = this.users.findIndex((user: CreateUserDto) => user.id === id);
        this.users.splice(index, 1, user);
        return `${user.id} updated via put`;
    }

    async patchUserById(id: string, user: PatchUserDto) {
        const index = this.users.findIndex((user: CreateUserDto) => user.id === id);
        let currentUser = this.users[index];
        const allowedPatchFields = [
            'password',
            'firstName',
            'lastName',
            'permissionLevel',
        ];
        for (let field of allowedPatchFields)
        {
            if (field in user) {
                // @ts-ignore
                currentUser[field] = user[field];
            }
        }
        this.users.splice(index, 1, currentUser);
        return `${user.id} patched`;
    }

    async removeUserById(id: string) {
        const index = this.users.findIndex(
            (user: { id: string }) => user.id === id
        );
        this.users.splice(index, 1);
        return `${id} removed`;
    }

    async getUserByEmail(email: string) {
        const index = this.users.findIndex(
            (user: { email: string }) => user.email === email
        );
        let currentUser = this.users[index];
        if (currentUser) {
            return currentUser;
        } else {
            return null;
        }
    }
}

export default new UsersDao();
