import { useEffect, ReactNode, useState } from "react";

import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

type UserType = "admin" | "seller" | "customer";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedTypes: UserType[];
}

const ProtectedRoute = ({ children, allowedTypes }: ProtectedRouteProps) => {
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (isClient && (!user || !allowedTypes.includes(user.type))) {
      router.push("/");
    }
  }, [user, allowedTypes, router, isClient]);

  if (!isClient || !user || !allowedTypes.includes(user.type)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
