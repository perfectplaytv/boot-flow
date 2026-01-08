import { onRequestPost as __api_auth_login_ts_onRequestPost } from "D:\\boot-flow\\functions\\api\\auth\\login.ts"
import { onRequestPost as __api_auth_register_ts_onRequestPost } from "D:\\boot-flow\\functions\\api\\auth\\register.ts"
import { onRequestPost as __api_storage_upload_ts_onRequestPost } from "D:\\boot-flow\\functions\\api\\storage\\upload.ts"
import { onRequestGet as __api_storage___path___ts_onRequestGet } from "D:\\boot-flow\\functions\\api\\storage\\[[path]].ts"
import { onRequestGet as __api_users_index_ts_onRequestGet } from "D:\\boot-flow\\functions\\api\\users\\index.ts"
import { onRequestPost as __api_users_index_ts_onRequestPost } from "D:\\boot-flow\\functions\\api\\users\\index.ts"

export const routes = [
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
      routePath: "/api/storage/upload",
      mountPath: "/api/storage",
      method: "POST",
      middlewares: [],
      modules: [__api_storage_upload_ts_onRequestPost],
    },
  {
      routePath: "/api/storage/:path*",
      mountPath: "/api/storage",
      method: "GET",
      middlewares: [],
      modules: [__api_storage___path___ts_onRequestGet],
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