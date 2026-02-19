export class CheckMobileModel {
  isUnique: boolean;
  message: string;

  constructor(data: { isUnique: boolean; message?: string }) {
    this.isUnique = data.isUnique;
    this.message =
      data.message ||
      (data.isUnique
        ? "Mobile number is available"
        : "Mobile number is already registered");
  }
}
