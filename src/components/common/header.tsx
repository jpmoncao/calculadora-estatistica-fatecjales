export default function Header() {
    return (
        <header className="flex justify-between items-center w-full h-20 border-b-2 border-primary text-primary-foreground">
            <div className="flex items-end gap-1 px-12 mr-auto max-[400px]:px-2">
                <h1 className="text-5xl font-bold text-primary max-[400px]:text-3xl">Estatística</h1>
                <h2 className="font-math text-xs font-semibold text-primary/60 mb-1 max-[400px]:text-[0.5em]">3º Sistemas para Internet</h2>
            </div>
        </header>
    )
}