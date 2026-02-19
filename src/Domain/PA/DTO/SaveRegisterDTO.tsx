export interface SaveRegisterDTO {
  first_name: string;
  middle_name?: string; // optional
  last_name: string;
  mobile: string;
  image?: string;       // base64 or URL
  id_type?: string;
  province?: string;
  city?: string;
  barangay?: string;
  gender?: string;
  birth_date?: string;
  civil_status?: string;
  type_of_payor?: string;
  email?: string;
  password?: string;
  ip_address?: string;
}
