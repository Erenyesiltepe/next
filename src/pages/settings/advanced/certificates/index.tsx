import { ReactElement, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { NextPageWithLayout } from "@/pages/_app"
import { apiService } from "@/services"
import { PlusCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

import { ICertificate } from "@/types/certificate"
import { DivergentColumn } from "@/types/table"
import { useEmitter } from "@/hooks/useEmitter"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import PageHeader from "@/components/ui/page-header"
import AdvancedLayout from "@/components/_layout/advanced_layout"
import { CertificateActions } from "@/components/settings/certificate-actions"

const AdvancedCertificateSettingsPage: NextPageWithLayout = () => {
  const router = useRouter()

  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<ICertificate[]>([])
  const { i18n } = useTranslation()

  const emitter = useEmitter()

  const columns: DivergentColumn<ICertificate, string>[] = [
    {
      accessorKey: "server_hostname",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hostname" />
      ),
      title: "Hostname",
    },
    {
      accessorKey: "origin",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Port" />
      ),
      title: "Port",
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Son Güncellenme Tarihi" />
      ),
      title: "Son Güncellenme Tarihi",
      cell: ({ row }) => (
        <>
          {row.original.updated_at
            ? new Date(row.original.updated_at).toLocaleDateString(
                i18n.language,
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )
            : "Bilinmiyor"}
        </>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <CertificateActions row={row} />
        </div>
      ),
    },
  ]

  const fetchData = () => {
    apiService
      .getInstance()
      .get<ICertificate[]>(`/settings/advanced/certificates`)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    emitter.on("REFETCH_CERTIFICATES", () => {
      fetchData()
    })
    return () => emitter.off("REFETCH_CERTIFICATES")
  }, [])

  return (
    <>
      <PageHeader
        title="Sertifikalar"
        description="Liman sunucusunun kabul edeceği sertifikaları buradan ekleyebilirsiniz."
      />

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable={false}
      >
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-8 lg:flex"
          onClick={() =>
            router.push("/settings/advanced/certificates/retrieve")
          }
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Ekle
        </Button>
      </DataTable>
    </>
  )
}

AdvancedCertificateSettingsPage.getLayout = function getLayout(
  page: ReactElement
) {
  return <AdvancedLayout>{page}</AdvancedLayout>
}

export default AdvancedCertificateSettingsPage
