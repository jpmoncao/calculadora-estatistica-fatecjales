export default function Header() {
    return (
        <header className="flex justify-between items-center w-full h-20 px-12 border-b-2 border-primary text-primary-foreground">
            <div className="flex items-end gap-1">
                <h1 className="text-5xl font-bold text-primary">Estatística</h1>
                <h2 className="font-math text-xs font-semibold text-primary/60 mb-1">3º Sistemas para Internet</h2>
            </div>
        </header>
    )
}