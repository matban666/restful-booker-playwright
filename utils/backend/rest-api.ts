// Not currently used, but could be basis of backend tests and for cleaning up after tests

import axios from 'axios';
import { loadJsonTestConfig } from '../domain/json-loader';
import { FullConfig } from '@playwright/test';  
import { Room } from '../../test-data/types/room';

function loadRoomData(): Room[] {
    return loadJsonTestConfig('rooms.json');
}

async function login(config: FullConfig) {
    const { baseURL } = config.projects[0].use;
    
    const response = await axios.post(baseURL + 'auth/login', {
        username: 'admin',
        password: 'password',
    });

    // Extract the token from the response
    const setCookieHeader = response.headers['set-cookie'];
    const token = setCookieHeader && setCookieHeader.length > 0 ? setCookieHeader[0].split(';')[0] : '';

    return token;
}

export async function createAllRooms(config: FullConfig) {
    const token = await login(config)

    const headers = {
        'Content-Type': 'application/json', 
        'Cookie': token, 
    };

    const { baseURL } = config.projects[0].use;
    for (const body of loadRoomData()) {
        await axios.post(baseURL + 'room/', body, {headers});
    }   
}

export async function deleteAllRooms(config: FullConfig) {
    const token = await login(config)

    const headers = {
        'Content-Type': 'application/json', 
        'Cookie': token, 
    };

    const roomNames = new Set(loadRoomData().map((data: { roomName: string }) => data.roomName));

    const { baseURL } = config.projects[0].use;
    const response2 = await axios.get(baseURL + 'room/', {headers});

    for (const room of response2.data['rooms']) {
        if (roomNames.has(room.roomName)) {
            await axios.delete(`${baseURL}room/${room.roomid}`, {headers});
        }
    }
}