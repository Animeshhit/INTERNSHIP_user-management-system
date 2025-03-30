import { useEffect, useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UpdateUserDialog } from "@/components/update-user-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/lib/use-media-query";
import { User } from "@/types/global";
import { toast } from "sonner";

export default function UserList() {
  // Check if the screen is mobile
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Initial user data
  const [users, setUsers] = useState<User[]>([]);

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for update user dialog
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle delete user
  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      setIsDeleting(true);
      try {
        let baseUrl = import.meta.env.VITE_BASE_URL;
        if (baseUrl == undefined) {
          console.error("VITE_BASE_URL is not defined");
        }

        let res = await fetch(`${baseUrl}/api/users/${userToDelete}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to delete user");
        }
        toast.success("User deleted successfully!");
        setUsers(users.filter((user) => user.id !== userToDelete));
      } catch (err) {
        console.error("Error deleting user:", err);
        toast.error("Failed to delete user");
      } finally {
        setIsDeleting(false);
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    }
  };

  // Handle update user
  const handleUpdateClick = (user: User) => {
    setUserToUpdate(user);
    setUpdateDialogOpen(true);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    setLoading(true);
    try {
      //here update logic i have to create
      const baseUrl = import.meta.env.VITE_BASE_URL;
      if (baseUrl == undefined) {
        console.error("VITE_BASE_URL is not defined");
      }

      let response = await fetch(`${baseUrl}/api/users/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      const data = await response.json();
      toast.success("User updated successfully!");
      setUsers(users.map((user) => (user.id === updatedUser.id ? data : user)));
    } catch (error) {
      toast.error("Failed to update user");
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
      setUpdateDialogOpen(false);
      setUserToUpdate(null);
    }
  };

  useEffect(() => {
    // Fetch user data from API
    const fetchUsers = async () => {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      if (baseUrl == undefined) {
        console.error("VITE_BASE_URL is not defined");
      }
      try {
        const response = await fetch(`${baseUrl}/api/users`);
        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl my-6 font-semibold">All Users</h1>
      {/* Table view for desktop */}
      {!isMobile && (
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Avatar</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={`${user.first_name} ${user.last_name}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          className="cursor-pointer"
                          size="icon"
                          onClick={() => handleUpdateClick(user)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit user {user.id}</span>
                        </Button>
                        <Button
                          disabled={isDeleting && user.id == userToDelete}
                          variant="destructive"
                          className="cursor-pointer flex items-center justify-center"
                          size="icon"
                          onClick={() => handleDeleteClick(user.id)}
                        >
                          {isDeleting && user.id == userToDelete ? (
                            <>
                              <Loader2 className="  h-4 w-4 animate-spin" />
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">
                                Delete user {user.id}
                              </span>
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Card view for mobile */}
      {isMobile && (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full flex-shrink-0">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={`${user.first_name} ${user.last_name}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {user.id}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleUpdateClick(user)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit user {user.id}</span>
                    </Button>
                    <Button
                      disabled={isDeleting && user.id == userToDelete}
                      variant="destructive"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDeleteClick(user.id)}
                    >
                      {isDeleting && user.id == userToDelete ? (
                        <>
                          <Loader2 className="  h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete user {user.id}</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update User Dialog */}
      {userToUpdate && (
        <UpdateUserDialog
          user={userToUpdate}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          onUpdate={handleUpdateUser}
          loading={loading}
        />
      )}
    </div>
  );
}
