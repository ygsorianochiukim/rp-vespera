import { Button } from "primereact/button";

interface Step5Props {
  form: any;
  preview: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  backstep2: () => void;
  verifyCard: () => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

export default function Step5({
  form,
  preview,
  handleChange,
  backstep2,
  verifyCard,
  setLoading,
  loading,
}: Step5Props) {
  return (
    <div id="step3" className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">
        Upload Government ID
      </h2>

      <p className="text-xs text-gray-500 mb-2">
        Upload any valid government ID (front only is enough to start).
      </p>

      <div>
        {/* ID Upload */}
        <label className="block text-sm font-medium text-gray-700">
          ID Upload <span className="text-red-500">*</span>
        </label>

        <input
          type="file"
          id="govId"
          name="govId"
          accept="image/jpeg,image/png"
          onChange={handleChange}
          className="bg-white mt-1 w-full rounded-lg border-gray-300 px-3 py-2"
        />

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="ID Preview"
            className="w-full h-40 object-cover rounded-lg border mt-2"
          />
        )}

        {/* File name if no preview */}
        {form.govId && !preview && <p className="mt-2">{form.govId.name}</p>}

        {/* Instructions */}
        <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg space-y-1 mt-2">
          <p>✔ Accepted file types: JPG, PNG</p>
          <p>✔ Max file size: 5MB</p>
          <p>✔ Ensure the image is clear and readable</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={backstep2}
            className="w-1/2 py-2 bg-accent text-white rounded-lg"
          >
            Back
          </button>

          <Button
            icon="pi pi-check"
            loading={loading}
            onClick={async () => {
              setLoading(true);
              try {
                await verifyCard();
              } finally {
                setLoading(false);
              }
            }}
            className={`w-1/2 py-2 rounded-lg justify-center  text-white transition-colors duration-200
    ${form.govId ? "bg-green-600 hover:bg-green-700" : "bg-green-300 cursor-not-allowed"}`}
            disabled={!form.govId}
          >
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
}
