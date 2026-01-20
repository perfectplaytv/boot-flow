import { onRequestPost as __api_admin_fix_orphans_ts_onRequestPost } from "D:\\boot-flow\\functions\\api\\admin\\fix-orphans.ts"
import { onRequestPost as __api_auth_login_ts_onRequestPost } from "D:\\boot-flow\\functions\\api\\auth\\login.ts"
import { onRequestPost as __api_auth_register_ts_onRequestPost } from "D:\\boot-flow\\functions\\api\\auth\\register.ts"
import { onRequestGet as __api_me_credentials_ts_onRequestGet } from "D:\\boot-flow\\functions\\api\\me\\credentials.ts"
import { onRequestPost as __api_storage_upload_ts_onRequestPost } from "D:\\boot-flow\\functions\\api\\storage\\upload.ts"
import { onRequestDelete as __api_resellers__id__ts_onRequestDelete } from "D:\\boot-flow\\functions\\api\\resellers\\[id].ts"
import { onRequestPatch as __api_resellers__id__ts_onRequestPatch } from "D:\\boot-flow\\functions\\api\\resellers\\[id].ts"
import { onRequestDelete as __api_users__id__ts_onRequestDelete } from "D:\\boot-flow\\functions\\api\\users\\[id].ts"
import { onRequestPatch as __api_users__id__ts_onRequestPatch } from "D:\\boot-flow\\functions\\api\\users\\[id].ts"
import { onRequestGet as __api_storage___path___ts_onRequestGet } from "D:\\boot-flow\\functions\\api\\storage\\[[path]].ts"
import { onRequestPost as __api_approve_subscription_ts_onRequestPost } from "D:\\boot-flow\\functions\\api\\approve-subscription.ts"
import { onRequestPost as __api_check_payment_ts_onRequestPost } from "D:\\boot-flow\\functions\\api\\check-payment.ts"
import { onRequestPost as __api_create_payment_ts_onRequestPost } from "D:\\boot-flow\\functions\\api\\create-payment.ts"
import { onRequestPost as __api_create_reseller_ts_onRequestPost } from "D:\\boot-flow\\functions\\api\\create-reseller.ts"
import { onRequestGet as __api_plans_ts_onRequestGet } from "D:\\boot-flow\\functions\\api\\plans.ts"
import { onRequestPost as __api_plans_ts_onRequestPost } from "D:\\boot-flow\\functions\\api\\plans.ts"
import { onRequestGet as __api_proxy_ts_onRequestGet } from "D:\\boot-flow\\functions\\api\\proxy.ts"
import { onRequestGet as __api_resellers_index_ts_onRequestGet } from "D:\\boot-flow\\functions\\api\\resellers\\index.ts"
import { onRequestPost as __api_resellers_index_ts_onRequestPost } from "D:\\boot-flow\\functions\\api\\resellers\\index.ts"
import { onRequestGet as __api_subscriptions_ts_onRequestGet } from "D:\\boot-flow\\functions\\api\\subscriptions.ts"
import { onRequestPost as __api_subscriptions_ts_onRequestPost } from "D:\\boot-flow\\functions\\api\\subscriptions.ts"
import { onRequestGet as __api_users_index_ts_onRequestGet } from "D:\\boot-flow\\functions\\api\\users\\index.ts"
import { onRequestPost as __api_users_index_ts_onRequestPost } from "D:\\boot-flow\\functions\\api\\users\\index.ts"

export const routes = [
    {
      routePath: "/api/admin/fix-orphans",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_fix_orphans_ts_onRequestPost],
    },
  {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_login_ts_onRequestPost],
    },
  {
      routePath: "/api/auth/register",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_register_ts_onRequestPost],
    },
  {
      routePath: "/api/me/credentials",
      mountPath: "/api/me",
      method: "GET",
      middlewares: [],
      modules: [__api_me_credentials_ts_onRequestGet],
    },
  {
      routePath: "/api/storage/upload",
      mountPath: "/api/storage",
      method: "POST",
      middlewares: [],
      modules: [__api_storage_upload_ts_onRequestPost],
    },
  {
      routePath: "/api/resellers/:id",
      mountPath: "/api/resellers",
      method: "DELETE",
      middlewares: [],
      modules: [__api_resellers__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/resellers/:id",
      mountPath: "/api/resellers",
      method: "PATCH",
      middlewares: [],
      modules: [__api_resellers__id__ts_onRequestPatch],
    },
  {
      routePath: "/api/users/:id",
      mountPath: "/api/users",
      method: "DELETE",
      middlewares: [],
      modules: [__api_users__id__ts_onRequestDelete],
    },
  {
      routePath: "/api/users/:id",
      mountPath: "/api/users",
      method: "PATCH",
      middlewares: [],
      modules: [__api_users__id__ts_onRequestPatch],
    },
  {
      routePath: "/api/storage/:path*",
      mountPath: "/api/storage",
      method: "GET",
      middlewares: [],
      modules: [__api_storage___path___ts_onRequestGet],
    },
  {
      routePath: "/api/approve-subscription",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_approve_subscription_ts_onRequestPost],
    },
  {
      routePath: "/api/check-payment",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_check_payment_ts_onRequestPost],
    },
  {
      routePath: "/api/create-payment",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_create_payment_ts_onRequestPost],
    },
  {
      routePath: "/api/create-reseller",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_create_reseller_ts_onRequestPost],
    },
  {
      routePath: "/api/plans",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_plans_ts_onRequestGet],
    },
  {
      routePath: "/api/plans",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_plans_ts_onRequestPost],
    },
  {
      routePath: "/api/proxy",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_proxy_ts_onRequestGet],
    },
  {
      routePath: "/api/resellers",
      mountPath: "/api/resellers",
      method: "GET",
      middlewares: [],
      modules: [__api_resellers_index_ts_onRequestGet],
    },
  {
      routePath: "/api/resellers",
      mountPath: "/api/resellers",
      method: "POST",
      middlewares: [],
      modules: [__api_resellers_index_ts_onRequestPost],
    },
  {
      routePath: "/api/subscriptions",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_subscriptions_ts_onRequestGet],
    },
  {
      routePath: "/api/subscriptions",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_subscriptions_ts_onRequestPost],
    },
  {
      routePath: "/api/users",
      mountPath: "/api/users",
      method: "GET",
      middlewares: [],
      modules: [__api_users_index_ts_onRequestGet],
    },
  {
      routePath: "/api/users",
      mountPath: "/api/users",
      method: "POST",
      middlewares: [],
      modules: [__api_users_index_ts_onRequestPost],
    },
  ]