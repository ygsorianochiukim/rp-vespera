import { useEffect, useState } from "react";
import { LocationService } from "@/Domain/PA/Services/BuyerRegService";
import { LocationModel } from "@/Domain/PA/Model/BuyerRegModel";
import { ApiService } from "@/Domain/PA/Services/ApiService";
import { SendOtpModel } from "@/Domain/PA/Model/sendOtpModel";
import { OtpVerificationModel } from "@/Domain/PA/Model/OtpVerificationModel";
import { VerifyIdModel } from "@/Domain/PA/Model/VerifyIdModel";
import { useRouter } from "next/navigation";

export function useRegister(showToast: (options: any) => void) {
  const [step, setStep] = useState<number>(1);
  const router = useRouter();
  const apiservice = new ApiService();

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
    otp: "",
    govId: null as File | null,
    base64: "",
    province: "",
    province_name: "",
    city: "",
    city_name: "",
    barangay: "",
    barangay_name: "",
    gender: "",
    birthDate: "",
    birthPlace: "",
    civilStatus: "",
    nationality: "",
    typeOfPayor: "Individual",
    email: "",
    password: "",
    password_confirmation: "",
    hashed_password: "",
    ip_address: "",
    id_type: "",
    valid_id: false,
  });

  const resetForm = () => {
    setForm({
      firstName: "",
      middleName: "",
      lastName: "",
      mobile: "",
      otp: "",
      govId: null as File | null,
      base64: "",
      province: "",
      province_name: "",
      city: "",
      city_name: "",
      barangay: "",
      barangay_name: "",
      gender: "",
      birthDate: "",
      birthPlace: "",
      civilStatus: "",
      nationality: "",
      typeOfPayor: "Individual",
      email: "",
      password: "",
      password_confirmation: "",
      hashed_password: "",
      ip_address: "",
      id_type: "",
      valid_id: false,
    });
  };

  const [otpTimer, setOtpTimer] = useState(0);
  const [otpInterval, setOtpInterval] = useState<number | null>(null);

  const [provinces, setProvinces] = useState<LocationModel[]>([]);
  const [cities, setCities] = useState<LocationModel[]>([]);
  const [barangays, setBarangays] = useState<LocationModel[]>([]);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const verifyID = () => {
    if (!form.govId) {
      alert("Please upload your government ID.");
      return;
    }
    console.log("Verifying ID:", form.govId);
    setStep(3); // move to next step
  };
  // -------------------------------
  // OTP Timer
  // -------------------------------
  const startOtpTimer = () => {
    setOtpTimer(300);
    const interval = window.setInterval(
      () => setOtpTimer((prev) => prev - 1),
      1000,
    );
    setOtpInterval(interval);
  };

  useEffect(() => {
    if (otpTimer <= 0 && otpInterval !== null) {
      clearInterval(otpInterval);
      setOtpInterval(null);
    }
  }, [otpTimer, otpInterval]);

  // -------------------------------
  // Handle Input
  // -------------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;

    if (
      target instanceof HTMLInputElement &&
      target.files &&
      name === "govId"
    ) {
      const file = target.files[0];
      const allowed = ["image/jpeg", "image/png"];
      if (!allowed.includes(file.type)) {
        showToast({
          severity: "error",
          summary: "Invalid File",
          detail: "Only JPG/PNG allowed",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast({
          severity: "error",
          summary: "File Too Large",
          detail: "Max 5MB allowed",
        });
        return;
      }
      setForm((prev) => ({ ...prev, govId: file }));

      // set preview
      if (file.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }

      return;
    }

    // Normal input/select changes
    setForm((prev) => {
      if (name === "province")
        return { ...prev, province: value, city: "", barangay: "" };
      if (name === "city") return { ...prev, city: value, barangay: "" };
      return { ...prev, [name]: value };
    });
  };

  // -------------------------------
  // Send OTP
  // -------------------------------
  const sendOTP = async () => {
    const customer: SendOtpModel = {
      firstName: form.firstName,
      middleName: form.middleName || "",
      lastName: form.lastName,
      mobile: form.mobile,
    };

    if (!customer.mobile || !customer.firstName || !customer.lastName) {
      showToast({
        severity: "error",
        summary: "Missing Fields",
        detail: "Please fill required fields",
      });
      return;
    }

    try {
      await apiservice.sendOtp(customer, "PA"); // you can change "PA" dynamically
      startOtpTimer();

      showToast({
        severity: "success",
        summary: "OTP Sent",
        detail: "OTP has been sent to your mobile number",
      });

      setStep(1.1);
    } catch (error: any) {
      showToast({
        severity: "error",
        summary: "Error",
        detail: error.message || "Something went wrong",
      });
    }
  };

  const verifyOTP = async () => {
    const customer: OtpVerificationModel = {
      firstName: form.firstName,
      middleName: form.middleName || "",
      lastName: form.lastName,
      mobile: form.mobile,
    };

    if (!form.otp) {
      showToast({
        severity: "error",
        summary: "Missing Fields",
        detail: "Please fill required fields",
      });
      return;
    }

    try {
      await apiservice.verifyOtp(customer, form.otp, "PA");

      showToast({
        severity: "success",
        summary: "OTP Verified",
        detail: "Your OTP is correct, proceed to next step",
      });

      setStep(2); // move to next step
    } catch (error: any) {
      showToast({
        severity: "error",
        summary: "Error",
        detail: error.message || "Something went wrong",
      });
    }
  };

  const verifyCard = async () => {
    try {
      const provinceName =
        provinces.find((p) => p.code === form.province)?.name || "";
      const cityName = cities.find((c) => c.code === form.city)?.name || "";
      const barangayName =
        barangays.find((b) => b.code === form.barangay)?.name || "";

      const model: VerifyIdModel = {
        ...form,
        province: provinceName,
        city: cityName,
        barangay: barangayName,
      };

      const result = await apiservice.verifyId(model);
      if (!result.valid_id) {
        showToast({
          severity: "error",
          summary: "ID Verification Failed",
          detail:
            result.message ||
            "The ID is not valid. Please try again with a different ID.",
        });
        return;
      }

      showToast({
        severity: "success",
        summary: "ID Verified",
        detail: result.message,
      });

      setForm((prev) => ({
        ...prev,
        province_name: provinceName,
        city_name: cityName,
        barangay_name: barangayName,
        base64: result.image_base64,
        valid_id: Boolean(result.valid_id),
        id_type: result.id_type,
      }));

      setStep(4);
    } catch (error: any) {
      showToast({
        severity: "error",
        summary: "Verification Failed",
        detail: error.message,
      });
      console.error("Verification error:", error);
    }
  };

  const nextStep = () => {
    // List of required fields
    const requiredFields = ["gender", "birthDate", "civilStatus"] as const;

    // Find any empty required field
    const emptyField = requiredFields.find(
      (field) =>
        !form[field as keyof typeof form] ||
        (form[field as keyof typeof form] as string).trim() === "",
    );

    if (emptyField) {
      showToast({
        severity: "error",
        summary: "Missing Fields",
        detail: `Please fill out the ${emptyField} field`,
      });
      return; // Stop progression
    }

    // If all required fields are filled
    showToast({
      severity: "success",
      summary: "Next Page",
      detail: "Proceeding to next step",
    });

    setStep(2.1);
  };

  const nextStep3 = () => {
    // Required location fields
    const requiredFields = ["province", "city", "barangay"];

    // Find any empty required field
    const emptyField = requiredFields.find(
      (field) =>
        !form[field as keyof typeof form] ||
        (form[field as keyof typeof form] as string).trim() === "",
    );

    if (emptyField) {
      // Map field names to user-friendly labels
      const fieldLabels: Record<string, string> = {
        province: "Province",
        city: "City",
        barangay: "Barangay",
      };

      showToast({
        severity: "error",
        summary: "Missing Fields",
        detail: `Please select your ${fieldLabels[emptyField]}`,
      });
      return; // Stop progression
    }

    // All required fields selected
    showToast({
      severity: "success",
      summary: "Next Page",
      detail: "Proceeding to next step",
    });
    setStep(3);
  };

  const nextStep5 = async () => {
    if (!form.password || !form.password_confirmation) {
      showToast({
        severity: "error",
        summary: "Missing Fields",
        detail: "Please enter both password and confirmation",
      });
      return;
    }

    if (form.password !== form.password_confirmation) {
      showToast({
        severity: "error",
        summary: "Password Mismatch",
        detail: "Password and confirmation do not match",
      });
      return;
    }

    try {
      const api = new ApiService();
      const result = await api.savePassword({
        password: form.password,
        password_confirmation: form.password_confirmation,
      });

      setForm((prev) => ({
        ...prev,
        hashed_password: result.hashed_password,
        ip_address: result.ip_address,
      }));
      setStep(5);
    } catch (error: any) {
      showToast({
        severity: "error",
        summary: "Validation Error",
        detail: error.message,
      });
    }
  };

  const backstep2 = () => {
    showToast({
      severity: "success",
      summary: "Previous Page",
      detail: "Returning to previous step",
    });
    setStep(2.1);
  };
  const backstep = () => {
    showToast({
      severity: "success",
      summary: "Previous Page",
      detail: "Returning to previous step",
    });
    setStep(2);
  };

  const onsubmit = async () => {
    try {
      const result = await apiservice.registerUser({
        first_name: form.firstName,
        middle_name: form.middleName,
        last_name: form.lastName,
        mobile: form.mobile,
        email: form.email,
        password: form.hashed_password,
        province: form.province,
        city: form.city,
        barangay: form.barangay,
        gender: form.gender,
        birth_date: form.birthDate,
        civil_status: form.civilStatus,
        type_of_payor: form.typeOfPayor,
        image: form.base64,
        id_type: form.id_type,
        ip_address: form.ip_address,
      });

      if (result.success) {
        showToast({
          severity: "success",
          summary: "Registration Successful",
          detail: result.message || "User registered successfully",
        });
        resetForm();
        router.push("https://park.renaissance.ph/login");
      }
    } catch (error: any) {
      showToast({
        severity: "error",
        summary: "Registration Failed",
        detail: error.message,
      });
    }
  };
  // -------------------------------
  // Load Locations
  // -------------------------------
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const data = await LocationService.getProvinces();
        setProvinces(data);
      } catch (err) {
        console.error(err);
        showToast({
          severity: "error",
          summary: "Error",
          detail: "Failed to load provinces",
        });
      } finally {
        setLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, []);

  useEffect(() => {
    if (!form.province) {
      setCities([]);
      setBarangays([]);
      return;
    }

    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const data = await LocationService.getCities(form.province);
        setCities(data);
        setBarangays([]);
      } catch (err) {
        console.error(err);
        showToast({
          severity: "error",
          summary: "Error",
          detail: "Failed to load cities",
        });
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, [form.province]);

  useEffect(() => {
    if (!form.city) {
      setBarangays([]);
      return;
    }

    const loadBarangays = async () => {
      setLoadingBarangays(true);
      try {
        const data = await LocationService.getBarangays(form.city);
        setBarangays(data);
      } catch (err) {
        console.error(err);
        showToast({
          severity: "error",
          summary: "Error",
          detail: "Failed to load barangays",
        });
      } finally {
        setLoadingBarangays(false);
      }
    };
    loadBarangays();
  }, [form.city]);

  useEffect(() => {
    const savedForm = sessionStorage.getItem("buyerRegForm");
    const savedStep = sessionStorage.getItem("buyerRegStep");

    if (savedForm) {
      setForm((prev) => ({
        ...prev,
        ...JSON.parse(savedForm),
        govId: null, // File objects cannot be restored
      }));
    }

    if (savedStep) {
      setStep(Number(savedStep));
    }
  }, []);
  useEffect(() => {
    const { govId, ...safeForm } = form; // remove File object
    sessionStorage.setItem("buyerRegForm", JSON.stringify(safeForm));
  }, [form]);
  useEffect(() => {
    sessionStorage.setItem("buyerRegStep", String(step));
  }, [step]);
  return {
    step,
    form,
    otpTimer,
    provinces,
    cities,
    barangays,
    loadingProvinces,
    loadingCities,
    loadingBarangays,
    handleChange,
    sendOTP,
    verifyOTP,
    setStep,
    nextStep,
    nextStep3,
    backstep2,
    backstep,
    verifyID,
    setPreview,
    preview,
    verifyCard,
    nextStep5,
    onsubmit,
  };
}
