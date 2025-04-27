export default function Footer() {
    return (
        <footer className="bg-indigo-500 dark:bg-gray-900">
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <a href="https://flowbite.com/" className="flex items-center">
                            {/*<img src="https://flowbite.com/docs/images/logo.svg" className="h-8 me-3"*/}
                            {/*     alt="FlowBite Logo"/>*/}
                            <span
                                className="self-center text-2xl font-semibold whitespace-nowrap text-white">Rental Motor</span>
                        </a>
                    </div>

                </div>
            </div>
        </footer>
    )
}