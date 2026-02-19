import { Button } from "primereact/button";
import { ApiService } from "@/Domain/PA/Services/ApiService";
import { useState, useRef, useEffect } from "react";

interface Step1Props {
  form: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  nextStep: () => void;
  sendOTP: () => void;
  otpTimer: number;
}

export default function Step1({
  form,
  handleChange,
  sendOTP,
  otpTimer,
}: Step1Props) {
  const [loading, setLoading] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [checkingMobile, setCheckingMobile] = useState(false);

  const api = new ApiService();
  let mobileTimeout: NodeJS.Timeout;
  
  useEffect(() => {
    if (!form.mobile) {
      setMobileError("");
      return;
    }

    clearTimeout(mobileTimeout);
    mobileTimeout = setTimeout(async () => {
      setCheckingMobile(true);
      try {
        const result = await api.checkMobileUnique({
          mobile: form.mobile,
        });
        if (!result.isUnique) setMobileError(result.message);
        else setMobileError("");
      } catch (error: any) {
        setMobileError("Your mobile number is invalid.");
      }
      setCheckingMobile(false);
    }, 500);

    return () => clearTimeout(mobileTimeout);
  }, [form.mobile]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Basic Information</h2>

      {/* First Name */}
      <div className="flex flex-col">
        <label htmlFor="firstName" className="text-sm font-medium text-dark">
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="bg-white w-full rounded-lg px-3 py-2"
        />
      </div>

      {/* Middle Name */}
      <div className="flex flex-col">
        <label htmlFor="middleName" className="text-sm font-medium text-dark">
          Middle Name <span className="text-gray-700">(Optional)</span>
        </label>
        <input
          type="text"
          id="middleName"
          name="middleName"
          value={form.middleName}
          onChange={handleChange}
          placeholder="Middle Name"
          className="bg-white w-full rounded-lg px-3 py-2"
        />
      </div>

      {/* Last Name */}
      <div className="flex flex-col">
        <label htmlFor="lastName" className="text-sm font-medium text-dark">
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="bg-white w-full rounded-lg px-3 py-2"
        />
      </div>

      {/* Mobile Number */}
      <div className="flex flex-col">
        <label htmlFor="mobile" className="text-sm font-medium text-dark">
          Mobile Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="mobile"
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          placeholder="Mobile"
          className={`bg-white mt-1 w-full rounded-lg border px-3 py-2 focus:ring-green-500 focus:border-green-500
            ${mobileError ? "border-red-500" : "border-gray-300"}`}
        />
          {checkingMobile && (
          <span className="text-xs text-gray-500 mt-1">Checking mobile...</span>
        )}
        {mobileError && (
          <span className="text-xs text-red-500 mt-1">{mobileError}</span>
        )}
      </div>

      {/* Send OTP */}
      <Button
        type="button"
        onClick={sendOTP}
        disabled={otpTimer > 0 || loading || !!mobileError}
      >
        {otpTimer > 0
          ? `Resend in ${Math.floor(otpTimer / 60)}:${String(
              otpTimer % 60,
            ).padStart(2, "0")}`
          : loading
            ? "Checking..."
            : "Send OTP"}
      </Button>
    </div>
  );
}
