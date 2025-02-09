import { ReactElement, useEffect } from "react"
import Head from "next/head"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Fingerprint, Mail, Save, Server, UserCheck2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/ui/page-header"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import AccessLayout from "@/components/_layout/access_layout"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form/form"

const formSchema = z.object({
  server_address: z.string().nonempty("LDAP sunucu adresi boş bırakılamaz."),
  objectguid: z
    .string()
    .nonempty("LDAP şemanızdaki objectguid alanının adını yazınız."),
  mail: z.string().nonempty("LDAP şemanızdaki mail alanının adını yazınız."),
  active: z.boolean(),
})

const AccessLdapPage: NextPageWithLayout = () => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const handleSave = (data: z.infer<typeof formSchema>) => {
    apiService
      .getInstance()
      .post("/settings/access/ldap/configuration", data)
      .then(() => {
        toast({
          title: "Başarılı",
          description: "LDAP bağlantısı ayarları başarıyla kaydedildi.",
        })
      })
      .catch(() => {
        toast({
          title: "Hata",
          description:
            "LDAP bağlantısı ayarları kaydedilirken bir hata oluştu.",
          variant: "destructive",
        })
      })
  }

  useEffect(() => {
    apiService
      .getInstance()
      .get("/settings/access/ldap/configuration")
      .then((res) => {
        form.reset(res.data)
      })
  }, [])

  return (
    <>
      <Head>
        <title>LDAP Bağlantısı | Liman</title>
      </Head>

      <PageHeader
        title="LDAP Bağlantısı"
        description="Liman'a giriş yaparken LDAP bağlantısı kullanabilir ve detaylı şekilde erişim yetkilerini konfigüre edebilirsiniz."
      />

      <div className="px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
            <FormField
              control={form.control}
              name="server_address"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="server_address">Sunucu Adresi</Label>
                  <div className="relative">
                    <Input
                      id="server_address"
                      className="pl-10"
                      placeholder="ldaps.fabrikam.com"
                      {...field}
                    />
                    <Server className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <small className="italic text-muted-foreground">
                      Aktif dizin, Samba veya kullandığınız LDAP sağlayıcının
                      bağlantı adresini giriniz. Bu bağlantı adresi Liman
                      sunucunuz tarafından çözülebilir olmalıdır.
                    </small>
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="objectguid"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="objectguid">Object GUID Alanı</Label>
                  <div className="relative">
                    <Input
                      id="objectguid"
                      className="pl-10"
                      placeholder="objectguid"
                      {...field}
                    />
                    <Fingerprint className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <small className="italic text-muted-foreground">
                      LDAP şemanızda aktif şekilde kullanımda olan objectguid
                      alanının adını yazınız. Bu alanın değeri standart olarak
                      objectguid olmasına rağmen bazı kurulumlarda farklılık
                      gösterebilir.
                    </small>
                  </div>

                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="mail"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="mail">Mail Alanı</Label>
                  <div className="relative">
                    <Input
                      id="mail"
                      className="pl-10"
                      placeholder="mail"
                      {...field}
                    />
                    <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <small className="italic text-muted-foreground">
                      LDAP şemanızda aktif şekilde kullanımda olan mail alanının
                      adını yazınız. Bu alanın değeri standart olarak mail
                      olmasına rağmen bazı kurulumlarda farklılık gösterebilir.
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
                      <FormLabel>Entegrasyonu aktifleştir</FormLabel>
                      <FormDescription>
                        Entegrasyonu aktifleştirdiğinizde izin tanımladığınız
                        LDAP kullanıcıları Liman&apos;a kullanıcı adlarını
                        kullanarak giriş yapabilirler.
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
                Kaydet
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

AccessLdapPage.getLayout = function getLayout(page: ReactElement) {
  return <AccessLayout>{page}</AccessLayout>
}

export default AccessLdapPage
