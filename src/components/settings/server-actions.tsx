import { useState } from "react"
import { apiService } from "@/services"
import { Row } from "@tanstack/react-table"
import { Edit2, MoreHorizontal, Trash } from "lucide-react"
import { useTranslation } from "react-i18next"

import { IServer } from "@/types/server"
import { useEmitter } from "@/hooks/useEmitter"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Icons } from "../ui/icons"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useToast } from "../ui/use-toast"

export function ServerRowActions({ row }: { row: Row<IServer> }) {
  const server = row.original
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [editDialog, setEditDialog] = useState(false)
  const { toast } = useToast()
  const { t } = useTranslation("settings")

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-5 w-5 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setEditDialog(true)}>
            <Edit2 className="mr-2 h-3.5 w-3.5" />
            {t("servers.actions.edit_btn")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteDialog(true)}>
            <Trash className="mr-2 h-3.5 w-3.5" />
            {t("servers.actions.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteServer
        open={deleteDialog}
        setOpen={setDeleteDialog}
        server={server}
      />
      <Edit open={editDialog} setOpen={setEditDialog} server={server} />
    </>
  )
}

function Edit({
  open,
  setOpen,
  server,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  server: IServer
}) {
  const emitter = useEmitter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState<string>(server.name)
  const [ipAddress, setIpAddress] = useState<string>(server.ip_address)
  const { t } = useTranslation("settings")

  const handleEdit = () => {
    setLoading(true)

    apiService
      .getInstance()
      .patch(`/servers/${server.id}`, { name: name, ip_address: ipAddress })
      .then(() => {
        toast({
          title: t("success"),
          description: t("servers.actions.edit.success_msg"),
        })
        emitter.emit("REFETCH_SERVERS")
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("servers.actions.edit.error_msg"),
          variant: "destructive",
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t("servers.actions.edit.title")}</DialogTitle>
          <DialogDescription>
            {t("servers.actions.edit.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 grid w-full items-center gap-1.5">
          <Label htmlFor="edit">{t("servers.actions.edit.form.name")}</Label>
          <Input
            id="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>

        <div className="mt-3 grid w-full items-center gap-1.5">
          <Label htmlFor="edit">
            {t("servers.actions.edit.form.ip_address")}
          </Label>
          <Input
            id="ip_address"
            onChange={(e) => setIpAddress(e.target.value)}
            value={ipAddress}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="mr-2"
          >
            {t("servers.actions.edit.form.cancel")}
          </Button>
          <Button disabled={loading} onClick={() => handleEdit()}>
            {!loading ? (
              <Edit2 className="mr-2 h-4 w-4" />
            ) : (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("servers.actions.edit.form.submit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DeleteServer({
  open,
  setOpen,
  server,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  server: IServer
}) {
  const emitter = useEmitter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation("settings")

  const handleDelete = () => {
    setLoading(true)

    apiService
      .getInstance()
      .delete(`/servers/${server.id}`)
      .then(() => {
        toast({
          title: t("success"),
          description: t("servers.actions.delete_dialog.success_msg"),
        })
        emitter.emit("REFETCH_SERVERS")
        setOpen(false)
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("servers.actions.delete_dialog.error_msg"),
          variant: "destructive",
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <AlertDialog open={open} onOpenChange={(open) => setOpen(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("servers.actions.delete_dialog.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span
              dangerouslySetInnerHTML={{
                // TODO: Localization
                // Couldn't find a better way to use tags with localized strings
                // If i find any i'll change it.
                __html: t("servers.actions.delete_dialog.description", {
                  server: server.name,
                }),
              }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("servers.actions.delete_dialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete()}>
            {loading && <Icons.spinner className="h-4 w-4 animate-spin" />}
            {t("servers.actions.delete_dialog.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
