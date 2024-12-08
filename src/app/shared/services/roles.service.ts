import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private roleSignal = signal<string | null>(null);

  constructor() {
    const savedRole = localStorage.getItem('userRole');
    this.roleSignal.set(savedRole);
  }

  get role() {
    return this.roleSignal.asReadonly();
  }

  setRole(role: string) {
    localStorage.setItem('userRole', role);
    this.roleSignal.set(role);
  }

  getRole(): string | null {
    return this.roleSignal();
  }

  clearRole() {
    localStorage.removeItem('userRole');
    this.roleSignal.set(null);
  }
}
