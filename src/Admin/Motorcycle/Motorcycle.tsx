import Sidebar from "@/Admin/Utility/Sidebar.tsx";
import { useEffect, useState, useRef } from "react";
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

interface Motorcycle {
    ID?: number;
    nama_motor: string;
    jenis_motor: string;
    nomor_plat_motor: string;
    qty_motor: number;
    harga_sewa_motor: number;
    tanggal_pinjam: string;
    tanggal_kembali: string;
    image_motor?: string;
}

export default function Motorcycle() {
    const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
    const [newMotorcycle, setNewMotorcycle] = useState<Motorcycle>({
        nama_motor: "",
        jenis_motor: "",
        nomor_plat_motor: "",
        qty_motor: 0,
        harga_sewa_motor: 0,
        tanggal_pinjam: "",
        tanggal_kembali: ""
    });
    const [editingMotorcycle, setEditingMotorcycle] = useState<Motorcycle | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreate = async () => {

        if (!imageFile) {
            alert("Please select an image file");
            return;
        }


        try {
            const formData = new FormData();


            Object.entries(newMotorcycle).forEach(([key, value]) => {
                formData.append(key, value.toString());
            });


            if (imageFile) {
                formData.append('image_motor', imageFile);
            }

            await axios.post(
                "http://localhost:8080/admin/add-data-motorcycle",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Reset form
            setNewMotorcycle({
                nama_motor: "",
                jenis_motor: "",
                nomor_plat_motor: "",
                qty_motor: 0,
                harga_sewa_motor: 0,
                tanggal_pinjam: "",
                tanggal_kembali: ""
            });
            setImageFile(null);
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            fetchMotorcycles(); // Reload data
        } catch (error) {
            console.error("Error creating motorcycle:", error);
        }
    };

    const handleEdit = async () => {
        if (!editingMotorcycle) return;

        try {
            const formData = new FormData();

            // Append all motorcycle data to formData
            Object.entries(editingMotorcycle).forEach(([key, value]) => {
                if (key !== 'ID' && value !== undefined) {
                    formData.append(key, value.toString());
                }
            });

            // Only append image if a new one is selected
            if (imageFile) {
                formData.append('image_motor', imageFile);
            } else if (editingMotorcycle.image_motor) {
                // If no new image but existing image exists, send the existing image path
                formData.append('existing_image', editingMotorcycle.image_motor);
            }

            const response = await axios.put(
                `http://localhost:8080/admin/update-data-motorcycle/${editingMotorcycle.ID}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Reset editing state
            setEditingMotorcycle(null);
            setImageFile(null);
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            fetchMotorcycles();
        } catch (error) {
            console.error("Error updating motorcycle:", error);
            // Add user feedback here
            alert("Failed to update motorcycle: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (motorcycleID: number) => {
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

    const startEdit = (motorcycle: Motorcycle) => {
        setEditingMotorcycle(motorcycle);
        setImagePreview(motorcycle.image_motor ? `http://localhost:8080/${motorcycle.image_motor}` : null);
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
                                    <Label htmlFor="nama_motor">Nama Motor</Label>
                                    <Input
                                        id="nama_motor"
                                        placeholder="Nama Motor"
                                        value={newMotorcycle.nama_motor}
                                        onChange={(e) => setNewMotorcycle({ ...newMotorcycle, nama_motor: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="jenis_motor">Jenis Motor</Label>
                                    <Input
                                        id="jenis_motor"
                                        placeholder="Jenis Motor"
                                        value={newMotorcycle.jenis_motor}
                                        onChange={(e) => setNewMotorcycle({ ...newMotorcycle, jenis_motor: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nomor_plat_motor">Nomor Plat Motor</Label>
                                    <Input
                                        id="nomor_plat_motor"
                                        placeholder="Nomor Plat Motor"
                                        value={newMotorcycle.nomor_plat_motor}
                                        onChange={(e) => setNewMotorcycle({ ...newMotorcycle, nomor_plat_motor: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="qty_motor">Quantity Motor</Label>
                                    <Input
                                        id="qty_motor"
                                        type="number"
                                        placeholder="Quantity Motor"
                                        value={newMotorcycle.qty_motor}
                                        onChange={(e) => setNewMotorcycle({
                                            ...newMotorcycle,
                                            qty_motor: parseInt(e.target.value, 10) || 0
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="harga_sewa_motor">Harga Sewa Motor</Label>
                                    <Input
                                        id="harga_sewa_motor"
                                        type="number"
                                        placeholder="Harga Sewa Motor"
                                        value={newMotorcycle.harga_sewa_motor}
                                        onChange={(e) => setNewMotorcycle({
                                            ...newMotorcycle,
                                            harga_sewa_motor: parseInt(e.target.value, 10) || 0
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_pinjam">Tanggal Pinjam</Label>
                                    <Input
                                        id="tanggal_pinjam"
                                        type="date"
                                        value={newMotorcycle.tanggal_pinjam}
                                        onChange={(e) => setNewMotorcycle({ ...newMotorcycle, tanggal_pinjam: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_kembali">Tanggal Kembali</Label>
                                    <Input
                                        id="tanggal_kembali"
                                        type="date"
                                        value={newMotorcycle.tanggal_kembali}
                                        onChange={(e) => setNewMotorcycle({ ...newMotorcycle, tanggal_kembali: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="image_motor">Image Motor</Label>
                                    <Input
                                        id="image_motor"
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-20 w-20 object-cover rounded"
                                            />
                                        </div>
                                    )}
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
                                        <Label htmlFor="edit-nama_motor">Nama Motor</Label>
                                        <Input
                                            id="edit-nama_motor"
                                            placeholder="Nama Motor"
                                            value={editingMotorcycle.nama_motor}
                                            onChange={(e) =>
                                                setEditingMotorcycle({ ...editingMotorcycle, nama_motor: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-jenis_motor">Jenis Motor</Label>
                                        <Input
                                            id="edit-jenis_motor"
                                            placeholder="Jenis Motor"
                                            value={editingMotorcycle.jenis_motor}
                                            onChange={(e) =>
                                                setEditingMotorcycle({ ...editingMotorcycle, jenis_motor: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-nomor_plat_motor">Nomor Plat Motor</Label>
                                        <Input
                                            id="edit-nomor_plat_motor"
                                            placeholder="Nomor Plat Motor"
                                            value={editingMotorcycle.nomor_plat_motor}
                                            onChange={(e) =>
                                                setEditingMotorcycle({ ...editingMotorcycle, nomor_plat_motor: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-qty_motor">Quantity Motor</Label>
                                        <Input
                                            id="edit-qty_motor"
                                            type="number"
                                            placeholder="Quantity Motor"
                                            value={editingMotorcycle.qty_motor}
                                            onChange={(e) =>
                                                setEditingMotorcycle({
                                                    ...editingMotorcycle,
                                                    qty_motor: parseInt(e.target.value, 10) || 0
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-harga_sewa_motor">Harga Sewa Motor</Label>
                                        <Input
                                            id="edit-harga_sewa_motor"
                                            type="number"
                                            placeholder="Harga Sewa Motor"
                                            value={editingMotorcycle.harga_sewa_motor}
                                            onChange={(e) =>
                                                setEditingMotorcycle({
                                                    ...editingMotorcycle,
                                                    harga_sewa_motor: parseInt(e.target.value, 10) || 0
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-tanggal_pinjam">Tanggal Pinjam</Label>
                                        <Input
                                            id="edit-tanggal_pinjam"
                                            type="date"
                                            value={editingMotorcycle.tanggal_pinjam}
                                            onChange={(e) =>
                                                setEditingMotorcycle({ ...editingMotorcycle, tanggal_pinjam: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-tanggal_kembali">Tanggal Kembali</Label>
                                        <Input
                                            id="edit-tanggal_kembali"
                                            type="date"
                                            value={editingMotorcycle.tanggal_kembali}
                                            onChange={(e) =>
                                                setEditingMotorcycle({ ...editingMotorcycle, tanggal_kembali: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-image_motor">Image Motor</Label>
                                        <Input
                                            id="edit-image_motor"
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                        />
                                        {imagePreview && (
                                            <div className="mt-2">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="h-20 w-20 object-cover rounded"
                                                />
                                            </div>
                                        )}
                                        {!imagePreview && editingMotorcycle.image_motor && (
                                            <div className="mt-2">
                                                <img
                                                    src={`http://localhost:8080/${editingMotorcycle.image_motor}`}
                                                    alt="Current"
                                                    className="h-20 w-20 object-cover rounded"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline" onClick={() => {
                                    setEditingMotorcycle(null);
                                    setImagePreview(null);
                                }}>
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
                                        <TableHead>Image</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.isArray(motorcycles) && motorcycles.length > 0 ? (
                                        motorcycles.map((motorcycle) => (
                                            <TableRow key={motorcycle.ID}>
                                                <TableCell className="font-medium">{motorcycle.nama_motor}</TableCell>
                                                <TableCell>{motorcycle.jenis_motor}</TableCell>
                                                <TableCell>{motorcycle.nomor_plat_motor}</TableCell>
                                                <TableCell>{motorcycle.qty_motor}</TableCell>
                                                <TableCell>{motorcycle.harga_sewa_motor}</TableCell>
                                                <TableCell>
                                                    {motorcycle.image_motor && (
                                                        <img
                                                            src={`http://localhost:8080/${motorcycle.image_motor}`}
                                                            alt={motorcycle.nama_motor}
                                                            className="h-10 w-10 object-cover rounded"
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => startEdit(motorcycle)}
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
                                                                        This will permanently delete the motorcycle {motorcycle.nama_motor}. This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(motorcycle.ID!)}>
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