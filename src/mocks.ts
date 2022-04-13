import { USER_ROLES, HTTP_METHOD } from "./types";
import type { IRequest } from './types'

export const userMock = {
    name: 'User Name',
    age: 26,
    roles: [
        USER_ROLES.USER,
        USER_ROLES.ADMIN
    ],
    createdAt: new Date(),
    isDeleted: false
};
  
export const requestsMock: IRequest[] = [
    {
        method: HTTP_METHOD.POST,
        host: 'service.example',
        path: 'user',
        body: userMock,
        params: {},
    },
    {
        method: HTTP_METHOD.GET,
        host: 'service.example',
        path: 'user',
        params: {
            id: '3f5h67s4s'
        }
    }
];