import React from "react"
import { headers } from "next/headers"

const page = async () => {
  const host = (await headers()).get("host") ?? ""

  const subdomain = host.split(".")[0]

  return (
    <div>
      tenant dashboard
      <div>
        Host: {host}
        <br />
        Subdomain: {subdomain}
      </div>
    </div>
  )
}

export default page
