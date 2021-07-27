import { useRouter } from "next/router";
import { Role } from "../../lib/model";
import storage from "../../lib/services/storage";

export function useUserRole(): Role {
  const router = useRouter();

  return storage.role || (router.pathname.split("/")[2] as Role);
}
