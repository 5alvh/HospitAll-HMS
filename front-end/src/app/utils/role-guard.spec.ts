import { Router } from '@angular/router';
import { RoleGuard } from './role-guard';
import { LocalStorageManagerService } from '../services/auth/local-storage-manager.service';

describe('RoleGuard', () => {
  it('should create an instance', () => {
    const localS = new LocalStorageManagerService();
    const router = new Router();
    expect(new RoleGuard(localS, router)).toBeTruthy();
  });
});
