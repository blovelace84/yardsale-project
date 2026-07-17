function Footer() {
    return (
        <footer className="mt-auto border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-slate-500">
                &copy; {new Date().getFullYear()} Online Yard Sale. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;