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

  let defaultSS = 0
  let defaultMM = 0

  if(defaultValue) {
    defaultSS = defaultValue % 60
    defaultMM = (defaultValue - defaultSS)/60
  }

  const handeChange = (ev: SyntheticEvent) => {
    const el = ev.target as HTMLInputElement
    let time = 0

    const val = Number(el.value)
    const ss = Number((ssRef.current as HTMLInputElement).value)
    const mm = Number((mmRef.current as HTMLInputElement).value)

    if(el.name === "time_mm") {
      time = (val*60) + ss
    } else {
      time = (mm*60) + val
    }

    // console.log({
    //   val, mm, ss, time
    // })

    if(onChange) {
      onChange(time)
    }
  }

  return <div className="flex gap-2">
    <Input ref={mmRef} onChange={handeChange} required defaultValue={defaultMM} placeholder="mm" name="time_mm"  type="number" />
    <Input ref={ssRef} max="59" step="0.01" onChange={handeChange} required defaultValue={defaultSS} placeholder="ss" name="time_ss" type="number" />
  </div>
}

export default TimeInput
