import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { ChevronDown, ChevronRight, ToyBrick } from "lucide-react"

import { IExtension } from "@/types/extension"
import { IMenu } from "@/types/server"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n - 1) + "..." : str
}

export default function ExtensionItem({
  extension,
  server_id,
  disabled,
}: {
  extension: IExtension
  server_id: string
  disabled?: boolean
}) {
  const router = useRouter()
  const [hash, setHash] = useState<string>("")
  useEffect(() => {
    if (window) {
      window.addEventListener("hashchange", () => {
        setHash(window.location.hash)
      })
    }

    return () => {
      if (window) {
        window.removeEventListener("hashchange", () => {
          setHash(window.location.hash)
        })
      }
    }
  }, [])

  useEffect(() => {
    if (router.asPath.includes(extension.id)) {
      setHash(window.location.hash)
    }
  }, [extension.id, router.asPath])

  return (
    <Collapsible open={router.asPath.includes(extension.id)}>
      <CollapsibleTrigger className="w-full">
        {!router.asPath.includes(extension.id) ||
        !router.asPath.includes(server_id) ? (
          <Link
            href={`/servers/${server_id}/extensions/${extension.id}${
              extension.menus && extension.menus.length > 0
                ? extension.menus[0].url
                : ""
            }`}
            onClick={(e) => {
              if (disabled) {
                e.preventDefault()
              } else {
                setHash("")
              }
            }}
          >
            <Button
              variant={
                router.asPath.includes(extension.id) &&
                router.asPath.includes(server_id)
                  ? "secondary"
                  : "ghost"
              }
              size="sm"
              className="w-full justify-start"
              disabled={disabled}
            >
              <div className="flex items-center gap-2">
                <div className="flex w-[18px] items-center justify-center">
                  {extension.icon ? (
                    <i className={`fa-solid fa-${extension.icon} fa-fw`}></i>
                  ) : (
                    <ToyBrick className="h-4 w-4" />
                  )}
                </div>
                <span>{truncate(extension.display_name, 25)}</span>
              </div>
              {extension.menus && extension.menus.length > 0 && (
                <ChevronRight className="absolute right-6 h-4 w-4" />
              )}
            </Button>
          </Link>
        ) : (
          <a href="#">
            <Button
              variant={
                router.asPath.includes(extension.id) ? "secondary" : "ghost"
              }
              size="sm"
              className={cn(
                "w-full justify-start",
                extension.menus && extension.menus.length > 0 && "mb-1"
              )}
              disabled={disabled}
            >
              <div className="flex items-center gap-2">
                <div className="flex w-[18px] items-center justify-center">
                  {extension.icon ? (
                    <i className={`fa-solid fa-${extension.icon} fa-fw`}></i>
                  ) : (
                    <ToyBrick className="h-4 w-4" />
                  )}
                </div>
                <span>{truncate(extension.display_name, 25)}</span>
              </div>
              {extension.menus && extension.menus.length > 0 && (
                <ChevronDown className="absolute right-6 h-4 w-4" />
              )}
            </Button>
          </a>
        )}
      </CollapsibleTrigger>
      {router.asPath.includes(extension.id) &&
        router.asPath.includes(server_id) &&
        extension.menus &&
        extension.menus.length > 0 && (
          <>
            <CollapsibleContent className="mb-1 rounded-md border p-1">
              {extension.menus.map((menu: IMenu) => (
                <a href={menu.url} key={menu.url}>
                  <Button
                    variant={hash.includes(menu.url) ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                  >
                    {menu.name}
                  </Button>
                </a>
              ))}
            </CollapsibleContent>
          </>
        )}
    </Collapsible>
  )
}
