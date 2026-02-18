import { SendOtpDTO } from "../DTO/sendOtpDTO";
import { VerifyIdDTO } from "../DTO/VerifyIdDTO";
import { SavePasswordDTO } from "../DTO/SavePasswordDTO";
import { OtpVerificationModel } from "../Model/OtpVerificationModel";
import { SendOtpModel } from "../Model/sendOtpModel";
import { VerifyIdModel } from "../Model/VerifyIdModel";
import { SavePasswordModel } from "../Model/SavePasswordModel";
import { SaveRegisterDTO } from "../DTO/SaveRegisterDTO";
import { SaveRegisterModel } from "../Model/SaveRegisterModel";
import { CheckEmailDTO } from "../DTO/CheckEmailDTO";
import { CheckEmailModel } from "../Model/CheckEmailModel";
import { CheckMobileModel } from "../Model/CheckMobileModel";
import { CheckMobileDTO } from "../DTO/CheckMobileDTO";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // from .env

export class ApiService {
  private otpsend: string;
  private otpVerify: string;
  private verifyUrl: string;
  private savePasswordUrl: string;
  private registerUrl: string;
  private checkEmailUrl: string;
  private checkMobile: string;

  constructor() {
    if (!API_URL)
      throw new Error("API URL is not defined in environment variables");

    this.otpsend = `${API_URL}/sendOtp`;
    this.otpVerify = `${API_URL}/verifyOtp`;
    this.verifyUrl = `${API_URL}/verifyID`;
    this.savePasswordUrl = `${API_URL}/save-password`;
    this.registerUrl = `${API_URL}/register`;
    this.checkEmailUrl = `${API_URL}/check-email`;
    this.checkMobile = `${API_URL}/check-mobile`;
  }

  // -------------------- OTP --------------------
  static generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(customer: SendOtpModel, module = "PA"): Promise<void> {
    if (!customer.mobile || !customer.firstName || !customer.lastName)
      throw new Error("Please fill required fields");

    const otp = ApiService.generateOtp();

    const dto: SendOtpDTO = {
      phone: customer.mobile,
      fname: customer.firstName,
      mname: customer.middleName || null,
      lname: customer.lastName,
      module,
      otp,
      message: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };

    const response = await fetch(this.otpsend, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Failed to send OTP");
  }

  async verifyOtp(
    customer: OtpVerificationModel,
    otp: string,
    module: string = "CustomerSupport",
  ): Promise<void> {
    if (!otp) throw new Error("OTP is required");
    if (!customer.mobile || !customer.firstName || !customer.lastName)
      throw new Error("Customer details are incomplete");

    const payload = {
      name1:
        `${customer.firstName} ${customer.middleName || ""} ${customer.lastName}`.trim(),
      phone: customer.mobile,
      module,
      otp,
    };

    const response = await fetch(this.otpVerify, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok)
      throw new Error(data.message || "OTP verification failed");
  }

  // -------------------- ID Verification --------------------
  async verifyId(model: VerifyIdModel): Promise<any> {
    if (!model.govId) throw new Error("Government ID is required");

    const dto: VerifyIdDTO = {
      gov_id: model.govId,
      fname: model.firstName,
      mname: model.middleName || "",
      lname: model.lastName,
      province: model.province,
      city: model.city,
      barangay: model.barangay,
    };

    const formData = new FormData();
    Object.entries(dto).forEach(([key, value]) => formData.append(key, value));

    const response = await fetch(this.verifyUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success)
      throw new Error(data.message || "Verification failed");

    return data.data;
  }

  // -------------------- Save Password --------------------
  async savePassword(dto: SavePasswordDTO): Promise<SavePasswordModel> {
    const response = await fetch(this.savePasswordUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.password?.[0] || "Password save failed");
    }

    return {
      success: data.success,
      hashed_password: data.hashed_password,
      ip_address: data.ip_address,
    };
  }
  async registerUser(payload: SaveRegisterDTO): Promise<SaveRegisterModel> {
    const response = await fetch(this.registerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      // If backend sends validation errors
      throw new Error(data.message || "Registration failed");
    }

    return {
      success: data.success,
      message: data.message,
      user_id: data.user_id,
      email: data.email,
    };
  }
  async checkEmail(dto: CheckEmailDTO): Promise<CheckEmailModel> {
    const res = await fetch(
      `${this.checkEmailUrl}?email=${encodeURIComponent(dto.email)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    const data = await res.json(); // { isUnique: boolean }
    return new CheckEmailModel(data);
  }

  async checkMobileUnique(dto: CheckMobileDTO): Promise<CheckMobileModel> {
    const response = await fetch(
      `${this.checkMobile}?mobile=${encodeURIComponent(dto.mobile)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    const data = await response.json();
    return new CheckMobileModel(data);
  }
}
