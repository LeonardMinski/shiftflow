import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FieldProps = {
  id: string;
  label: string;
  type?: "text" | "email";
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export function Field({
  id,
  label,
  type = "text",
  value,
  placeholder,
  onChange,
}: FieldProps) {
  return (
    <div>
      <Label
        htmlFor={id}
        className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-black/45"
      >
        {label}
      </Label>

      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        required
        onChange={(event) => onChange(event.target.value)}
        className="
          w-full border-0 border-b border-black/25
          bg-transparent px-0 py-3 text-[15px] text-black
          outline-none transition
          placeholder:text-black/25
          focus:border-black
        "
      />
    </div>
  );
}
