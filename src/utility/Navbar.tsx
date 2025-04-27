'use client'

import { useState } from "react"
import {Link} from "react-router-dom"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import "../index.css"

const Navbar = () => {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-indigo-500  fixed top-0 w-full z-50">
            <div className="text-xl font-bold text-white">
                Rental Motor
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6 text-white">
                <Link to="/">
                    {/*<Button variant="link" className="text-white">Home</Button>*/}
                </Link>
                <Link to="/login">
                    <Button variant="link" className="text-white">Login</Button>
                </Link>
                <Link to="/register">
                    <Button variant="link" className="text-white">Register</Button>
                </Link>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[250px] pt-10">
                        <div className="flex flex-col text-center space-y-4">
                            <Link to="/" onClick={() => setOpen(false)} className="text-white">Home</Link>
                            <Link to="/motorcycles" onClick={() => setOpen(false)} className="text-white">Motorcycles</Link>
                            <Link to="/about" onClick={() => setOpen(false)} className="text-white">About</Link>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    )
}


export default Navbar
