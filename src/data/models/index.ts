import { Models } from "@rematch/core"
import { auth } from "./auth"
import { dashboard } from "./dashboard"
import { deliveries } from "./deliveries"
import { inventory } from "./inventory"
import { outlets } from "./outlets"
import { requests } from "./requests"

export interface RootModel extends Models<RootModel> {
  auth: typeof auth
  deliveries: typeof deliveries
  outlets: typeof outlets
  inventory: typeof inventory
  requests: typeof requests
  dashboard: typeof dashboard
}

export const models: RootModel = {
  auth,
  dashboard,
  deliveries,
  outlets,
  inventory,
  requests,
}
