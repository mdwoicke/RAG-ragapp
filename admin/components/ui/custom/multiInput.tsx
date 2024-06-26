import { Input, InputProps } from "@/components/ui/input";
import { XIcon } from "lucide-react";
import { Dispatch, SetStateAction, forwardRef, useState } from "react";

type InputElementsProps = InputProps & {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

const MultiInput = forwardRef<HTMLInputElement, InputElementsProps>(
  ({ value, onChange, ...props }, ref) => {
    if (value === null) {
      value = [];
    }

    const handleInputChange = (newValue: string, index: number) => {
      const newValues = [...value];
      newValues[index] = newValue;
      onChange(newValues);
    };

    const handleInputBlur = (
      e: React.FocusEvent<HTMLInputElement>,
      index: number,
    ) => {
      const newValue = e.target.value?.trim();
      handleInputChange(newValue, index);
    };

    const handleInputKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      index: number,
    ) => {
      if (e.key === "Enter" && e.currentTarget.value?.trim() !== "") {
        e.preventDefault();
        if (index === value.length - 1) {
          onChange([...value, ""]);
        }
      } else if (
        e.key === "Backspace" &&
        value[index] === "" &&
        value.length > 1
      ) {
        const newValues = [...value];
        newValues.splice(index, 1);
        onChange(newValues);
      }
    };

    const handleDeleteInput = (index: number) => {
      const newValues = [...value];
      newValues.splice(index, 1);
      if (newValues.length === 0) {
        newValues.push("");
      }
      onChange(newValues);
    };

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
      <>
        {value &&
          value.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-row w-full px-2 justify-between items-center relative"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Input
                value={item}
                onChange={(e) => handleInputChange(e.target.value, idx)}
                onBlur={(e) => handleInputBlur(e, idx)}
                onKeyDown={(e) => handleInputKeyDown(e, idx)}
                className="border border-gray-300 rounded-md px-2 py-1"
                autoFocus={idx === value.length - 1}
                {...props}
                ref={ref}
              />
              {hoveredIndex === idx && (
                <>
                  <button
                    type="button"
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 w-3 font-bold"
                    onClick={() => handleDeleteInput(idx)}
                  >
                    <span className="sr-only">Delete</span>
                    <XIcon className="w-3" strokeWidth={3} />
                  </button>
                </>
              )}
            </div>
          ))}
        {value && value[value.length - 1]?.trim() !== "" && (
          <div className="flex flex-row w-full px-2 justify-between items-center relative">
            <Input
              value=""
              onChange={(e) => {
                const newValues = [...value, e.target.value];
                onChange(newValues.filter((item) => item?.trim() !== ""));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value?.trim() !== "") {
                  const newValues = [...value, e.currentTarget.value?.trim()];
                  onChange(newValues.filter((item) => item?.trim() !== ""));
                  e.currentTarget.value = "";
                }
              }}
              className="border border-gray-300 rounded-md px-2 py-1"
              {...props}
              ref={ref}
            />
          </div>
        )}
      </>
    );
  },
);

MultiInput.displayName = "MultiInput";

export { MultiInput };
