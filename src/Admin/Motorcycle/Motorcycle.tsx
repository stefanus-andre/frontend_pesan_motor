import Sidebar from "@/Admin/Utility/Sidebar.tsx";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function Motorcycle() {
    const [motorcycles, setMotorcycles] = useState<any[]>([]);
    const [newMotorcycle, setNewMotorcycle] = useState({ nama_motor: "", jenis_motor: "", nomor_plat_motor:  "", qty_motor: "", harga_sewa_motor: 0, tanggal_pinjam: "", tanggal_kembali: "", image_motor: ""});
    const [editingMotorcycle, setEditingMotorcycle] = useState<any | null>(null);

    useEffect(() => {
        fetchMotorcycles();
    }, []);

    const fetchMotorcycles = async () => {
        try {
            const response = await axios.get("http://localhost:8080/admin/get-all-data-motorcycle", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (Array.isArray(response.data["data semua motorcycles"])) {
                setMotorcycles(response.data["data semua motorcycles"]);
            } else {
                console.error("Response data is not an array:", response.data);
                setMotorcycles([]);
            }
        } catch (error) {
            console.error("Error fetching motorcycles:", error);
            setMotorcycles([]);
        }
    };

    const handleCreate = async () => {
        try {
            await axios.post(
                "http://localhost:8080/admin/add-data-motorcycle",
                newMotorcycle,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setNewMotorcycle({ nama_motor: "", jenis_motor: "", nomor_plat_motor:  "", qty_motor: 0, harga_sewa_motor: 0, tanggal_pinjam: "", tanggal_kembali: "", image_motor: "" });
            fetchMotorcycles(); // 👈 reload data properly from backend
        } catch (error) {
            console.error("Error creating motorcycle:", error);
        }
    };

    const handleEdit = async () => {
        if (editingMotorcycle) {
            try {
                const response = await axios.put(
                        `http://localhost:8080/admin/update-data-motorcycle/${editingMotorcycle.id}`,
                    editingMotorcycle,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const updatedMotorcycles = motorcycles.map((motorcycle) =>
                    motorcycle.id === response.data.id ? response.data : motorcycle
                );
                setMotorcycles(updatedMotorcycles);
                setEditingMotorcycle(null);
            } catch (error) {
                console.error("Error updating motorcycle:", error);
            }
        }
    };

    const handleDelete = async (motorcycleID) => {
        if (!motorcycleID) {
            console.error("Error: Motorcycle ID is undefined");
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/admin/delete-data-motorcycle/${motorcycleID}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            fetchMotorcycles(); // Reload the data after successful deletion
        } catch (error) {
            console.error("Error deleting motorcycle:", error);
        }
    };


    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-6 overflow-auto">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Motorcycles</h2>

                    {/* Create form */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Add New Motorcycle</CardTitle>
                            <CardDescription>
                                Enter the details of the new motorcycle
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Motor</Label>
                                    <Input
                                        id="nama_motor"
                                        placeholder="Nama Motor"
                                        value={newMotorcycle.nama_motor}
                                        onChange={(e) => setNewMotorcycle({ ...newMotorcycle, nama_motor: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="brand">Jenis Motor</Label>
                                    <Input
                                        id="brand"
                                        placeholder="Jenis Motor"
                                        value={newMotorcycle.jenis_motor}
                                        onChange={(e) => setNewMotorcycle({ ...newMotorcycle, jenis_motor: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="brand">Nomor Plat Motor</Label>
                                    <Input
                                        id="brand"
                                        placeholder="Nomor Plat Motor"
                                        value={newMotorcycle.nomor_plat_motor}
                                        onChange={(e) => setNewMotorcycle({ ...newMotorcycle, nomor_plat_motor: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="brand">Quantity Motor</Label>
                                    <Input
                                        id="brand"
                                        type="number"
                                        placeholder="Quantity Motor"
                                        value={newMotorcycle.qty_motor}
                                        onChange={(e) => setNewMotorcycle({
                                            ...newMotorcycle,
                                            qty_motor: parseInt(e.target.value, 10) || 0 // memastikan jadi angka
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="brand">Harga Sewa Motor</Label>
                                    <Input
                                        id="brand"
                                        type="number"
                                        placeholder="Harga Sewa Motor"
                                        value={newMotorcycle.harga_sewa_motor}
                                        onChange={(e) => setNewMotorcycle({
                                            ...newMotorcycle,
                                            harga_sewa_motor: parseInt(e.target.value, 10) || 0 // memastikan jadi angka
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="brand">Tanggal Pinjam</Label>
                                    <Input
                                        id="tanggal_pinjam"
                                        type="date"
                                        value={newMotorcycle.tanggal_pinjam}
                                        onChange={(e) => setNewMotorcycle({ ...newMotorcycle, tanggal_pinjam: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="brand">Tanggal Kembali</Label>
                                    <Input
                                        id="tanggal_kembali"
                                        type="date"
                                        value={newMotorcycle.tanggal_kembali}
                                        onChange={(e) => setNewMotorcycle({ ...newMotorcycle, tanggal_kembali: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="brand">Image Motor</Label>
                                    <Input
                                        id="brand"
                                        placeholder="Image Motor"
                                        value={newMotorcycle.image_motor}
                                        onChange={(e) => setNewMotorcycle({ ...newMotorcycle, image_motor: e.target.value })}
                                    />
                                </div>

                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleCreate}>Create</Button>
                        </CardFooter>
                    </Card>

                    {/* Edit form */}
                    {editingMotorcycle && (
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>Edit Motorcycle</CardTitle>
                                <CardDescription>
                                    Update the details of the motorcycle
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-name">Motorcycle Name</Label>
                                        <Input
                                            id="edit-name"
                                            placeholder="Motorcycle Name"
                                            value={editingMotorcycle.nama_motor} // Change this
                                            onChange={(e) =>
                                                setEditingMotorcycle({ ...editingMotorcycle, nama_motor: e.target.value }) // Change this
                                            }
                                        />

                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-brand">Motorcycle Brand</Label>
                                        <Input
                                            id="edit-brand"
                                            placeholder="Motorcycle Brand"
                                            value={editingMotorcycle.brand}
                                            onChange={(e) =>
                                                setEditingMotorcycle({ ...editingMotorcycle, brand: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-year">Motorcycle Year</Label>
                                        <Input
                                            id="edit-brand"
                                            placeholder="Motorcycle Brand"
                                            value={editingMotorcycle.jenis_motor} // Change this
                                            onChange={(e) =>
                                                setEditingMotorcycle({ ...editingMotorcycle, jenis_motor: e.target.value }) // Change this
                                            }
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline" onClick={() => setEditingMotorcycle(null)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleEdit}>Update</Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Motorcycle Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Motorcycle List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableCaption>List of all motorcycles in the system</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Motor</TableHead>
                                        <TableHead>Jenis Motor</TableHead>
                                        <TableHead>Nomor Plat Motor</TableHead>
                                        <TableHead>Quantity Motor</TableHead>
                                        <TableHead>Harga Sewa Motor</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.isArray(motorcycles) && motorcycles.length > 0 ? (
                                        motorcycles.map((motorcycle) => (
                                            <TableRow key={motorcycle.id}>
                                                <TableCell className="font-medium">{motorcycle.nama_motor}</TableCell>
                                                <TableCell>{motorcycle.jenis_motor}</TableCell>
                                                <TableCell>{motorcycle.nomor_plat_motor}</TableCell>
                                                <TableCell>{motorcycle.qty_motor}</TableCell>
                                                <TableCell>{motorcycle.harga_sewa_motor}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {/*<Button*/}
                                                        {/*    variant="outline"*/}
                                                        {/*    size="sm"*/}
                                                        {/*    onClick={() => setEditingMotorcycle(motorcycle)}*/}
                                                        {/*>*/}
                                                        {/*    Edit*/}
                                                        {/*</Button>*/}
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="destructive" size="sm">Delete</Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This will permanently delete the motorcycle {motorcycle.nama_motor}. This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(motorcycle.ID)}>
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
                                            <TableCell colSpan={4} className="text-center">
                                                No motorcycles available
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