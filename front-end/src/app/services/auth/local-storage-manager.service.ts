import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageManagerService {

  constructor() { }

  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  setItem(key: string, value: string): void {
    this.clearStorage();
    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.error(`Error saving to localStorage: ${e}`);
      }
    }
  }

  getItem(key: string): string | null {
    if (this.isLocalStorageAvailable()) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.error(`Error reading from localStorage: ${e}`);
      }
    }
    return null;
  }

  removeItem(key: string): void {
    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error(`Error removing from localStorage: ${e}`);
      }
    }
  }

  clearStorage(): void {
    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.clear();
      } catch (e) {
        console.error(`Error clearing localStorage: ${e}`);
      }
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
