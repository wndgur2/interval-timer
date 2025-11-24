export default function NumberInput({
  value,
  label,
  onChange,
}: {
  value: number
  label: string
  onChange: (seconds: number) => void
}) {
  return (
    <div>
      <label>{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value, 10))} />
    </div>
  )
}
