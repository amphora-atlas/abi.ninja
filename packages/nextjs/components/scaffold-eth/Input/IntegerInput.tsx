import { useCallback, useEffect, useState } from "react";
import { parseEther, parseUnits } from "viem";
import { CommonInputProps, InputBase, IntegerVariant, isValidInteger } from "~~/components/scaffold-eth";

type DecimalOption = "none" | "6" | "18";

type IntegerInputProps = CommonInputProps<string> & {
  variant?: IntegerVariant;
  disableMultiplyBy1e18?: boolean;
};

export const IntegerInput = ({
  value,
  onChange,
  name,
  placeholder,
  disabled,
  variant = IntegerVariant.UINT256,
  disableMultiplyBy1e18 = false,
}: IntegerInputProps) => {
  const [inputError, setInputError] = useState(false);
  const [selectedDecimalOption, setSelectedDecimalOption] = useState<DecimalOption>("none");
  const [displayValue, setDisplayValue] = useState(value || "");

  const calculateRawValue = useCallback((inputValue: string, decimalOption: DecimalOption): string => {
    if (!inputValue || inputValue === "0" || decimalOption === "none") {
      return inputValue || "";
    }

    try {
      if (decimalOption === "18") {
        return parseEther(inputValue).toString();
      } else if (decimalOption === "6") {
        return parseUnits(inputValue, 6).toString();
      }
    } catch (error) {
      console.error("Error calculating raw value:", error);
    }

    return inputValue;
  }, []);

  const handleDecimalOptionChange = useCallback(
    (option: DecimalOption) => {
      setSelectedDecimalOption(option);
      if (displayValue) {
        const newRawValue = calculateRawValue(displayValue, option);
        onChange(newRawValue);
      }
    },
    [displayValue, onChange, calculateRawValue],
  );

  const handleInputChange = useCallback(
    (newDisplayValue: string) => {
      setDisplayValue(newDisplayValue);
      const newRawValue = calculateRawValue(newDisplayValue, selectedDecimalOption);
      onChange(newRawValue);
    },
    [selectedDecimalOption, onChange, calculateRawValue],
  );

  const formatDisplayValue = useCallback((rawVal: string): string => {
    if (!rawVal || rawVal === "0") return "";
    try {
      return Number(rawVal).toLocaleString();
    } catch {
      return rawVal;
    }
  }, []);

  const rawValue = calculateRawValue(displayValue, selectedDecimalOption);

  useEffect(() => {
    if (isValidInteger(variant, rawValue)) {
      setInputError(false);
    } else {
      setInputError(true);
    }
  }, [rawValue, variant]);

  useEffect(() => {
    if (value !== rawValue) {
      setDisplayValue(value || "");
    }
  }, [value, rawValue]);

  return (
    <div className="flex flex-col gap-2">
      <InputBase
        name={name}
        value={displayValue}
        placeholder={placeholder}
        error={inputError}
        onChange={handleInputChange}
        disabled={disabled}
        suffix={
          !inputError &&
          rawValue &&
          selectedDecimalOption !== "none" && (
            <div className="flex items-center px-4 text-sm text-gray-500">
              <span className="font-mono">{formatDisplayValue(rawValue)}</span>
              <div className="ml-2 w-4 h-4 flex items-center justify-center">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          )
        }
      />
      {!disableMultiplyBy1e18 && (
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 text-xs rounded-md border transition-colors ${
              selectedDecimalOption === "18"
                ? "bg-accent text-white border-accent"
                : "bg-transparent text-accent border-accent hover:bg-accent hover:text-white"
            } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            onClick={() => handleDecimalOptionChange("18")}
            disabled={disabled}
          >
            18 decimals
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-md border transition-colors ${
              selectedDecimalOption === "6"
                ? "bg-accent text-white border-accent"
                : "bg-transparent text-accent border-accent hover:bg-accent hover:text-white"
            } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            onClick={() => handleDecimalOptionChange("6")}
            disabled={disabled}
          >
            6 decimals
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-md border transition-colors ${
              selectedDecimalOption === "none"
                ? "bg-accent text-white border-accent"
                : "bg-transparent text-accent border-accent hover:bg-accent hover:text-white"
            } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            onClick={() => handleDecimalOptionChange("none")}
            disabled={disabled}
          >
            None
          </button>
        </div>
      )}
    </div>
  );
};
