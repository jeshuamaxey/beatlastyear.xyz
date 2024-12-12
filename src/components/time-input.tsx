import { SyntheticEvent, useRef } from "react"
import { Input } from "./ui/input"

type TimeInputProps = {
  defaultValue?: number
  name?: string
  onChange?: (newTime: number) => void
}

const TimeInput = ({ defaultValue, onChange }: TimeInputProps) => {
  const mmRef = useRef<HTMLInputElement>(null)
  const ssRef = useRef<HTMLInputElement>(null)

  let defaultMM = 0
  let defaultSS = 0

  if(defaultValue) {
    defaultMM = defaultValue % 60
    defaultSS = defaultValue = defaultMM
  }

  const handeChange = (ev: SyntheticEvent) => {
    const el = ev.target as HTMLInputElement
    let time = 0

    if(el.name === "time__mm") {
      time = Number(el.value)*60 + Number((ssRef.current as HTMLInputElement).value)
    } else {
      time = Number((mmRef.current as HTMLInputElement).value)*60 + Number(el.value)
    }

    if(onChange) {
      onChange(time)
    }
  }

  return <div className="flex gap-2">
    <Input ref={mmRef} onChange={handeChange} required defaultValue={defaultMM} placeholder="mm" name="time_mm"  type="number" />
    <Input ref={ssRef} max="59" onChange={handeChange} required defaultValue={defaultSS} placeholder="ss" name="time_ss" type="number" />
  </div>
}

export default TimeInput
