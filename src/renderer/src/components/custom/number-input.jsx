import { NumberInputRoot, NumberInputField } from "src/components/primitives/number-input"
import { InputGroup } from "src/components/primitives/input-group"
import { Field } from "src/components/primitives/field"
import { memo } from "react"

export const NumberInput = memo(function NumberInput({
  value,
  onValueChange,
  step,
  min,
  label,
  helper,
  icon,
  disabled = false,
  selectTextOnFocus = false,
  ...rest
}) {
  return (
    <Field label={label} helperText={helper || ""} disabled={disabled}>
      <NumberInputRoot
        min={min || 0}
        step={step || 1}
        value={+value || 0}
        onValueChange={(e) => onValueChange(+e.value)}
        w="full"
        disabled={disabled}
        {...rest}
      >
        <InputGroup flex="1" w="full" startElement={icon || null}>
          <NumberInputField
            onClick={(e) => {
              if (selectTextOnFocus) {
                e.target.focus()
                e.target.select()
              }
            }}
          />
        </InputGroup>
      </NumberInputRoot>
    </Field>
  )
})
