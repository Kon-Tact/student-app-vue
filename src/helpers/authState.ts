import cookieServiceInstance from '@/service/CookieService';
import { ref } from 'vue';
import library from './library';

export const isAuthenticated = cookieServiceInstance.getCookie(library.account) ? ref(true) : ref(false);
export const isAdministrator = cookieServiceInstance.getCookie(library.role)?.includes('ADMIN') ? ref(true) : ref(false);
export const connectedUsername = ref(localStorage.getItem(library.profil));
