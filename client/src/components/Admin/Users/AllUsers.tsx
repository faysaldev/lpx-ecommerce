"use client";
import {
  useAdminUsersQuery,
  useRemoveSingleUserMutation,
} from "@/redux/features/admin/Dashboard";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import { Input } from "@/components/UI/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import { Skeleton } from "@/components/UI/skeleton";
import { formatDate } from "@/lib/utils/helpers";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/UI/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

function AllUsers() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useAdminUsersQuery({
    page,
    limit,
    search,
    sortBy,
  });

  const [deleteUser] = useRemoveSingleUserMutation();

  const users = data?.data?.attributes?.users || [];
  const totalPages = data?.data?.attributes?.totalPages || 1;
  const currentPage = data?.data?.attributes?.currentPage || 1;

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = [...users];

    // Search filter
    if (search) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase()) ||
          user.phoneNumber?.includes(search)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [users, search, sortBy]);

  // Generate page numbers with ellipsis
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're at the beginning
      if (currentPage <= 2) {
        end = 4;
      }

      // Adjust if we're at the end
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("ellipsis-end");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await deleteUser(userId);
      if (res.data) toast("User Deactive Sucessfull");
    } catch (error) {}
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "admin":
        return "destructive";
      case "seller":
        return "default";
      case "customer":
        return "secondary";
      default:
        return "outline";
    }
  };

  const pageNumbers = generatePageNumbers();

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-400">Failed to load users</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#1A202C" }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            User Management
          </h1>
          <p className="text-gray-400">
            Manage and view all user accounts in the system
          </p>
        </div>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-white">All Users</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Input
                  placeholder="Search users by name, email, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-80 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <Select
                  value={sortBy}
                  onValueChange={(value: "newest" | "oldest") =>
                    setSortBy(value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-40 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 text-white">
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32 bg-gray-700" />
                      <Skeleton className="h-4 w-48 bg-gray-700" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="rounded-md border border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700 hover:bg-gray-750">
                        <TableHead className="text-gray-300 font-semibold">
                          User
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          Contact
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          Type
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          Joined
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          ID
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedUsers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-gray-400"
                          >
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAndSortedUsers.map((user) => (
                          <TableRow
                            key={user.id}
                            className="border-gray-700 hover:bg-gray-750 transition-colors"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-gray-600">
                                  <AvatarImage
                                    src={user.image}
                                    alt={user.name}
                                  />
                                  <AvatarFallback className="bg-gray-600 text-white">
                                    {getInitials(user.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-white">
                                    {user.name}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-white text-sm">
                                  {user.email}
                                </div>
                                <div className="text-gray-400 text-xs">
                                  {user.phoneNumber}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getTypeVariant(user.type)}
                                className="capitalize"
                              >
                                {user.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-300 text-sm">
                              {formatDate(user.createdAt)}
                            </TableCell>
                            <TableCell className="text-gray-400 text-xs font-mono">
                              {user.id.slice(0, 8)}...
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-gray-700"
                                  >
                                    <MoreVertical className="h-4 w-4 text-gray-300" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="bg-gray-800 border-gray-600 text-white"
                                >
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator className="bg-gray-600" />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="text-red-400 hover:text-red-300 hover:bg-gray-700 cursor-pointer"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Suspense User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        {/* Previous Button */}
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50 bg-gray-700 border-gray-600 text-gray-400"
                                : "cursor-pointer bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                            }
                          />
                        </PaginationItem>

                        {/* Page Numbers */}
                        {pageNumbers.map((pageNum, index) => (
                          <PaginationItem key={index}>
                            {pageNum === "ellipsis-start" ||
                            pageNum === "ellipsis-end" ? (
                              <PaginationEllipsis className="text-gray-400" />
                            ) : (
                              <PaginationLink
                                isActive={currentPage === pageNum}
                                onClick={() =>
                                  handlePageChange(pageNum as number)
                                }
                                className={
                                  currentPage === pageNum
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "cursor-pointer bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                }
                              >
                                {pageNum}
                              </PaginationLink>
                            )}
                          </PaginationItem>
                        ))}

                        {/* Next Button */}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50 bg-gray-700 border-gray-600 text-gray-400"
                                : "cursor-pointer bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AllUsers;

// "use client";
// import { useAdminUsersQuery } from "@/redux/features/admin/Dashboard";
// import { useState, useMemo } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/UI/table";
// import { Input } from "@/components/UI/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/UI/select";
// import { Button } from "@/components/UI/button";
// import { Badge } from "@/components/UI/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
// import { Skeleton } from "@/components/UI/skeleton";
// import { formatDate } from "@/lib/utils/helpers";

// function AllUsers() {
//   const [search, setSearch] = useState("");
//   const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   const { data, isLoading, error } = useAdminUsersQuery({
//     page,
//     limit,
//     search,
//     sortBy,
//   });

//   console.log(data?.data?.attributes, "datas");

//   const users = data?.data?.attributes?.users || [];
//   const totalPages = data?.data?.attributes?.totalPages || 1;
//   const totalRecords = data?.data?.attributes?.totalRecords || 0;
//   const currentPage = data?.data?.attributes?.currentPage || 1;

//   const filteredAndSortedUsers = useMemo(() => {
//     let filtered = [...users];

//     // Search filter
//     if (search) {
//       filtered = filtered.filter(
//         (user) =>
//           user.name?.toLowerCase().includes(search.toLowerCase()) ||
//           user.email?.toLowerCase().includes(search.toLowerCase()) ||
//           user.phoneNumber?.includes(search)
//       );
//     }

//     // Sort
//     filtered.sort((a, b) => {
//       const dateA = new Date(a.createdAt).getTime();
//       const dateB = new Date(b.createdAt).getTime();
//       return sortBy === "newest" ? dateB - dateA : dateA - dateB;
//     });

//     return filtered;
//   }, [users, search, sortBy]);

//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();
//   };

//   const getTypeVariant = (type: string) => {
//     switch (type) {
//       case "admin":
//         return "destructive";
//       case "seller":
//         return "default";
//       case "customer":
//         return "secondary";
//       default:
//         return "outline";
//     }
//   };

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
//           <p className="text-gray-400">Failed to load users</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6" style={{ backgroundColor: "#1A202C" }}>
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-white mb-2">
//             User Management
//           </h1>
//           <p className="text-gray-400">
//             Manage and view all user accounts in the system
//           </p>
//         </div>

//         <Card className="border-gray-700 bg-gray-800">
//           <CardHeader>
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//               <CardTitle className="text-white">All Users</CardTitle>
//               <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//                 <Input
//                   placeholder="Search users by name, email, or phone..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="w-full sm:w-80 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
//                 />
//                 <Select
//                   value={sortBy}
//                   onValueChange={(value: "newest" | "oldest") =>
//                     setSortBy(value)
//                   }
//                 >
//                   <SelectTrigger className="w-full sm:w-40 bg-gray-700 border-gray-600 text-white">
//                     <SelectValue placeholder="Sort by" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-gray-800 border-gray-600 text-white">
//                     <SelectItem value="newest">Newest First</SelectItem>
//                     <SelectItem value="oldest">Oldest First</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <div className="space-y-3">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <div key={i} className="flex items-center space-x-4">
//                     <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
//                     <div className="space-y-2">
//                       <Skeleton className="h-4 w-32 bg-gray-700" />
//                       <Skeleton className="h-4 w-48 bg-gray-700" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <>
//                 <div className="rounded-md border border-gray-700">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="border-gray-700 hover:bg-gray-750">
//                         <TableHead className="text-gray-300 font-semibold">
//                           User
//                         </TableHead>
//                         <TableHead className="text-gray-300 font-semibold">
//                           Contact
//                         </TableHead>
//                         <TableHead className="text-gray-300 font-semibold">
//                           Type
//                         </TableHead>
//                         <TableHead className="text-gray-300 font-semibold">
//                           Joined
//                         </TableHead>
//                         <TableHead className="text-gray-300 font-semibold">
//                           ID
//                         </TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {filteredAndSortedUsers.length === 0 ? (
//                         <TableRow>
//                           <TableCell
//                             colSpan={5}
//                             className="text-center py-8 text-gray-400"
//                           >
//                             No users found
//                           </TableCell>
//                         </TableRow>
//                       ) : (
//                         filteredAndSortedUsers.map((user) => (
//                           <TableRow
//                             key={user.id}
//                             className="border-gray-700 hover:bg-gray-750 transition-colors"
//                           >
//                             <TableCell>
//                               <div className="flex items-center gap-3">
//                                 <Avatar className="h-10 w-10 border border-gray-600">
//                                   <AvatarImage
//                                     src={user.image}
//                                     alt={user.name}
//                                   />
//                                   <AvatarFallback className="bg-gray-600 text-white">
//                                     {getInitials(user.name)}
//                                   </AvatarFallback>
//                                 </Avatar>
//                                 <div>
//                                   <div className="font-medium text-white">
//                                     {user.name}
//                                   </div>
//                                 </div>
//                               </div>
//                             </TableCell>
//                             <TableCell>
//                               <div className="space-y-1">
//                                 <div className="text-white text-sm">
//                                   {user.email}
//                                 </div>
//                                 <div className="text-gray-400 text-xs">
//                                   {user.phoneNumber}
//                                 </div>
//                               </div>
//                             </TableCell>
//                             <TableCell>
//                               <Badge
//                                 variant={getTypeVariant(user.type)}
//                                 className="capitalize"
//                               >
//                                 {user.type}
//                               </Badge>
//                             </TableCell>
//                             <TableCell className="text-gray-300 text-sm">
//                               {formatDate(user.createdAt)}
//                             </TableCell>
//                             <TableCell className="text-gray-400 text-xs font-mono">
//                               {user.id.slice(0, 8)}...
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>

//                 {/* Pagination */}
//               </>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// export default AllUsers;
