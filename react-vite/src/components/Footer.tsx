export function Footer(){
    const date = new Date();
    return (
        <footer className="flex justify-center text-gray-600">
            <p>&copy; {date.getFullYear()}</p>
        </footer>
    )
}