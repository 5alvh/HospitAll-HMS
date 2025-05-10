import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageManagerService {

  constructor() { }

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error(`Error saving to localStorage: ${e}`);
    }
  }

  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error(`Error reading from localStorage: ${e}`);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing from localStorage: ${e}`);
    }
  }

  clearStorage(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.error(`Error clearing localStorage: ${e}`);
    }
  }

  setToken(token: string): void {
    this.setItem('token', token);
  }

  getToken(): string | null {
    return this.getItem('token');
  }

  removeToken(): void {
    this.removeItem('token');
  }
}
