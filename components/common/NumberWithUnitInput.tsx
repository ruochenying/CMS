import { useState } from "react";
import { Input, InputNumber, Select } from "antd";

interface DurationInputValue<T = any> {
  number?: number;
  unit?: T;
}

interface NumberWithUnitInputProps<T = any> {
  value?: DurationInputValue;
  options?: { label: string; unit: T }[];
  onChange?: (value: DurationInputValue) => void;
  defaultUnit?: string | number;
}

const NumberWithUnitInput = ({
  value = {},
  onChange,
  options,
  defaultUnit,
}: NumberWithUnitInputProps) => {
  const [number, setNumber] = useState(value.number);
  const [unit, setUnit] = useState(value.unit || defaultUnit);

  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange?.({ number, unit, ...value, ...changedValue });
    }
  };

  const onNumberChange = (newNumber: number) => {
    if (Number.isNaN(number)) {
      return;
    }

    if (!("number" in value)) {
      setNumber(newNumber);
    }

    triggerChange({ number: newNumber });
  };
  const onUnitChange = (newUnit) => {
    if (!("unit" in value)) {
      setUnit(newUnit);
    }

    triggerChange({ unit: newUnit });
  };
  return (
    <Input.Group compact style={{ display: "flex" }}>
      <InputNumber
        value={value.number || number}
        onChange={onNumberChange}
        style={{ flex: 1 }}
      />
      <Select value={value.unit || unit} onChange={onUnitChange}>
        {options.map(({ label, unit }) => (
          <Select.Option value={unit} key={unit}>
            {label}
          </Select.Option>
        ))}
      </Select>
    </Input.Group>
  );
};

export default NumberWithUnitInput;
