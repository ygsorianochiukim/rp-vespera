export class CheckEmailModel {
  isUnique: boolean;
  message: string;

  constructor(data: { isUnique: boolean; message?: string }) {
    this.isUnique = data.isUnique;
    this.message = data.message || (data.isUnique ? "Email is available" : "Email is already registered");
  }
}