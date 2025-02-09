import { useEffect } from "react"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Key, Save, Server, User2, UserCheck2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form/form"

export default function MailSettingsPage() {
  const { toast } = useToast()
  const { t } = useTranslation("settings")

  const formSchema = z.object({
    encryption: z.enum(["tls", "ssl", "none"]),
    host: z.string().nonempty("Sunucu adresi boş bırakılamaz."),
    port: z.string().nonempty("Port boş bırakılamaz."),
    username: z.string().nonempty("Kullanıcı adı boş bırakılamaz."),
    password: z.string().optional(),
    active: z.boolean(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const handleSave = (data: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post("/settings/mail", data)
      .then(() => {
        toast({
          title: "Başarılı",
          description: "Mail ayarları başarıyla kaydedildi.",
        })
      })
      .catch((err) => {
        toast({
          title: "Hata",
          description: err.response.data.message,
          variant: "destructive",
        })
      })
  }

  useEffect(() => {
    apiService
      .getInstance()
      .get<z.infer<typeof formSchema>>("/settings/mail")
      .then((res) => {
        form.reset(res.data)
      })
  }, [])

  return (
    <>
      <PageHeader
        title={t("email.title")}
        description={t("email.description")}
      />

      <div className="px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="host">{t("email.form.host.label")}</Label>
                    <div className="relative">
                      <Input
                        id="host"
                        className="pl-10"
                        placeholder="mail.liman.dev"
                        {...field}
                      />
                      <Server className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <small className="italic text-muted-foreground">
                        {t("email.form.host.subtext")}
                      </small>
                    </div>
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="port">{t("email.form.port.label")}</Label>
                    <div className="relative">
                      <Input id="port" placeholder="587" {...field} />
                      <small className="italic text-muted-foreground">
                        {t("email.form.port.subtext")}
                      </small>
                    </div>
                    <FormMessage />
                  </div>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="username">
                    {t("email.form.username.label")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="username"
                      className="pl-10"
                      placeholder="noreply@liman.dev"
                      {...field}
                    />
                    <User2 className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <small className="italic text-muted-foreground">
                      {t("email.form.username.subtext")}
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="password">
                    {t("email.form.password.label")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      className="pl-10"
                      placeholder="*******************"
                      type="password"
                      {...field}
                    />
                    <Key className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <small className="italic text-muted-foreground">
                      {t("email.form.password.subtext")}
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="encryption"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="encryption">
                    {t("email.form.encryption.label")}
                  </Label>
                  <div className="relative">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Bir şifreleme türü seçiniz." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="none">
                          {t("email.form.encryption.none")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <small className="italic text-muted-foreground">
                      {t("email.form.encryption.subtext")}
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                  <div className="flex space-x-3 space-y-0.5">
                    <UserCheck2 className="h-6 w-6 text-muted-foreground" />
                    <div className="flex flex-col space-y-0.5">
                      <FormLabel>{t("email.form.active.label")}</FormLabel>
                      <FormDescription>
                        {t("email.form.active.subtext")}
                      </FormDescription>
                    </div>
                  </div>
                  <FormControl className="mt-[0!important]">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {t("email.form.save")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}
