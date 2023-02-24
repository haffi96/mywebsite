import { useEffect, useState } from "preact/hooks";

export default function ThemeToggle() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light");

    const handleClick = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <button className="px-5" onClick={handleClick}>{theme === "light" ? "🌚" : "🌞"}</button>
    );
}