export interface SavePasswordModel {
  success: boolean;
  hashed_password: string;
  ip_address: string;
}