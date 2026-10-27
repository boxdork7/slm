import { withHeaders } from '@/utils/function'

/**
 * 根据appid获取租户id
 * @param appid appid
 * @returns 租户id
 */
export const getTenantIdByAppid = (appid?: string): Result<string> => {
  return http.get<string>(
    `/app/home/getTenantIdByAppid?appid=${appid}`,
    {},
    withHeaders({ auth: false }, { skipWait: true }),
  )
}
