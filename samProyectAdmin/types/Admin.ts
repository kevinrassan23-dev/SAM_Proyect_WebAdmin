
/**
 * INTERFAZ DE ADMINISTRADOR
 */

export interface Administrador {
  id: number;
  email: string;
  password: string;
  nombre: string;
  rol: 'SHOP_ADMIN' | 'GOV_ADMIN' | 'SYSTEM_ADMIN' | 'ADMIN_OWNER';
}