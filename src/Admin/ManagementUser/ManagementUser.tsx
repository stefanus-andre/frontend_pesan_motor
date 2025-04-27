import UserSidebar from "@/Users/Utility/UserSidebar.tsx";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import Sidebar from "@/Admin/Utility/Sidebar.tsx";

export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [newUser, setNewUser] = useState({
        nama_lengkap: "",
        no_telp: "",
        nik: "",
        email: "",
        black_list: "No",
        password: "",
        roleID: 0
    });
    const [editingUser, setEditingUser] = useState<any | null>(null);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8080/admin/get-all-users", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (Array.isArray(response.data.data)) {
                setUsers(response.data.data);
            } else {
                console.error("Response data is not an array:", response.data);
                setUsers([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get("http://localhost:8080/admin/get-all-roles", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (Array.isArray(response.data.data)) {
                setRoles(response.data.data);
            } else {
                console.error("Response data is not an array:", response.data);
                setRoles([]);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setRoles([]);
        }
    };

    const handleCreate = async () => {
        try {
            await axios.post(
                "http://localhost:8080/admin/add-user",
                newUser,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setNewUser({
                nama_lengkap: "",
                no_telp: "",
                nik: "",
                email: "",
                black_list: "No",
                password: "",
                roleID: 0
            });
            fetchUsers(); // Reload data properly from backend
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const handleEdit = async () => {
        if (editingUser) {
            try {
                const response = await axios.put(
                    `http://localhost:8080/admin/update-user/${editingUser.ID}`,
                    editingUser,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const updatedUsers = users.map((user) =>
                    user.ID === response.data.ID ? response.data : user
                );
                setUsers(updatedUsers);
                setEditingUser(null);
            } catch (error) {
                console.error("Error updating user:", error);
            }
        }
    };

    const handleDelete = async (userID) => {
        if (!userID) {
            console.error("Error: User ID is undefined");
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/admin/delete-user/${userID}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            fetchUsers(); // Reload the data after successful deletion
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-6 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">User Management</h2>

                    {/* Create form */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Add New User</CardTitle>
                            <CardDescription>
                                Enter the details of the new user
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Full Name"
                                        value={newUser.nama_lengkap}
                                        onChange={(e) => setNewUser({ ...newUser, nama_lengkap: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        placeholder="Phone Number"
                                        value={newUser.no_telp}
                                        onChange={(e) => setNewUser({ ...newUser, no_telp: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nik">NIK</Label>
                                    <Input
                                        id="nik"
                                        placeholder="NIK"
                                        value={newUser.nik}
                                        onChange={(e) => setNewUser({ ...newUser, nik: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select
                                        onValueChange={(value) => setNewUser({ ...newUser, roleID: Number(value) })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem key={role.ID} value={role.ID.toString()}>
                                                    {role.Name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleCreate}>Create</Button>
                        </CardFooter>
                    </Card>

                    {/* Edit form */}
                    {editingUser && (
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>Edit User</CardTitle>
                                <CardDescription>
                                    Update the details of the user
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-name">Full Name</Label>
                                        <Input
                                            id="edit-name"
                                            placeholder="Full Name"
                                            value={editingUser.nama_lengkap}
                                            onChange={(e) =>
                                                setEditingUser({ ...editingUser, nama_lengkap: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-phone">Phone Number</Label>
                                        <Input
                                            id="edit-phone"
                                            placeholder="Phone Number"
                                            value={editingUser.no_telp}
                                            onChange={(e) =>
                                                setEditingUser({ ...editingUser, no_telp: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-nik">NIK</Label>
                                        <Input
                                            id="edit-nik"
                                            placeholder="NIK"
                                            value={editingUser.nik}
                                            onChange={(e) =>
                                                setEditingUser({ ...editingUser, nik: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-email">Email</Label>
                                        <Input
                                            id="edit-email"
                                            type="email"
                                            placeholder="Email"
                                            value={editingUser.email}
                                            onChange={(e) =>
                                                setEditingUser({ ...editingUser, email: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-blacklist">Blacklist Status</Label>
                                        <Select
                                            defaultValue={editingUser.black_list}
                                            onValueChange={(value) =>
                                                setEditingUser({ ...editingUser, black_list: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-role">Role</Label>
                                        <Select
                                            defaultValue={editingUser.roleID?.toString()}
                                            onValueChange={(value) =>
                                                setEditingUser({ ...editingUser, roleID: Number(value) })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem key={role.ID} value={role.ID.toString()}>
                                                        {role.Name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline" onClick={() => setEditingUser(null)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleEdit}>Update</Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* User Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>User List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableCaption>List of all users in the system</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Full Name</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>NIK</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Blacklisted</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.isArray(users) && users.length > 0 ? (
                                        users.map((user) => (
                                            <TableRow key={user.ID}>
                                                <TableCell className="font-medium">{user.nama_lengkap}</TableCell>
                                                <TableCell>{user.no_telp}</TableCell>
                                                <TableCell>{user.nik}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.black_list}</TableCell>
                                                <TableCell>{user.Role?.Name}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setEditingUser(user)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="destructive" size="sm">Delete</Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This will permanently delete the user {user.nama_lengkap}. This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(user.ID)}>
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center">
                                                No users available
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}