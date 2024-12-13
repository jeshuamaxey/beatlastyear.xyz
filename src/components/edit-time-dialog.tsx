"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import useTimeUpsert from "@/hooks/useTimeUpsert"
import { SyntheticEvent, useRef, useState } from "react"
import { Input } from "./ui/input"
import TimeInput from "./time-input"
import { Button } from "./ui/button"

type EditTimeDialogProps = {
  mode: "create" | "edit",
  defaults?: {
    year?: number,
    time?: number
  }
}

const EditTimeDialog = ({ mode, defaults }: EditTimeDialogProps) => {
  const [open, setOpen] = useState(false)

  const copy = mode === "create" ? {
    trigger: "Add",
    title: "Add a time"
  } : {
    trigger: "Edit",
    title: "Edit time"
  }

  const [newTimeSeconds, setNewTimeSeconds] = useState<number>(0)

  const timeUpsert = useTimeUpsert({
    onSuccess: () => {
      setOpen(false)
    }
  })

  const handleNewTime = (ev: SyntheticEvent) => {
    ev.preventDefault()
    const data = new FormData(ev.target as HTMLFormElement)
    const newTime = {
      year: Number(data.get('year')),
      time: newTimeSeconds
    }
    timeUpsert.mutate([newTime])
  }

  const triggerVariant = mode === "create" ? "default" : "ghost"
  const triggerSize = mode === "create" ? "default" : "sm"

  const saveBtnText = mode === "create" ? "Add" : "Update"
  const saveBtnLoadingText = mode === "create" ? "Adding..." : "Updating..."
 
  return <Dialog open={open} onOpenChange={setOpen}>
    <Button size={triggerSize} variant={triggerVariant} asChild>
      <DialogTrigger>{copy.trigger}</DialogTrigger>
    </Button>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{copy.title}</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your account
          and remove your data from our servers.
        </DialogDescription>
      </DialogHeader>
      <form className={`flex flex-col gap-2 ${timeUpsert.isPending ? "opacity-50" : null}`} onSubmit={handleNewTime}>
        <div className="flex gap-2">
          <Input required placeholder="year" name="year" type="number" defaultValue={defaults ? defaults.year : undefined} />
          <TimeInput onChange={setNewTimeSeconds} name="time" defaultValue={defaults?.time} />
        </div>
        <Button type="submit" disabled={timeUpsert.isPending}>
          {timeUpsert.isPending ? saveBtnLoadingText : saveBtnText}
        </Button>
      </form>
      
    </DialogContent>
  </Dialog>
}

export default EditTimeDialog
