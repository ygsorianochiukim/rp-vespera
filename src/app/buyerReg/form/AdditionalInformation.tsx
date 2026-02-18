import { Button } from "primereact/button";

interface Step2Props {
  form: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  nextStep: () => void;
  loading: boolean;
}

export default function Step3({
  form,
  handleChange,
  nextStep,
  loading,
}: Step2Props) {
  return (
    <div className="step2-form space-y-6 p-4">
      <h2 className="text-lg font-semibold text-gray-700">
        Additional Information
      </h2>

      {/* Gender */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-dark">
          Gender <span className="text-red-600">*</span>
        </label>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <span className="text-xs text-gray-700 mt-1">
          Please select your gender
        </span>
      </div>

      {/* Birth Date */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-dark">
          Birth Date <span className="text-red-600">*</span>
        </label>
        <input
          type="date"
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="text-xs text-gray-700 mt-1">
          Select your date of birth
        </span>
      </div>

      {/* Civil Status */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-dark">
          Civil Status <span className="text-red-600">*</span>
        </label>
        <select
          name="civilStatus"
          value={form.civilStatus}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Widowed">Widowed</option>
          <option value="Divorced">Divorced</option>
        </select>
        <span className="text-xs text-gray-700 mt-1">
          Your current marital status
        </span>
      </div>

      <div className="mt-4">
        <Button
          className="w-full justify-center sm:w-1/2 text-white rounded-lg"
          icon="pi pi-check"
          loading={loading}
          onClick={nextStep}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
