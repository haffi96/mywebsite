import { useState } from "preact/hooks";
import type { CollectionEntry } from 'astro:content';

interface BlogProps {
    allBlogs: CollectionEntry<'blogs'>[];
}

export default function BlogView({ allBlogs }: BlogProps) {

    const [databaseSelected, setDatabaseSelected] = useState(false);
    const [networkingSelected, setNetworkingSelected] = useState(false);
    const [tagFilters, _] = useState(new Set());

    const handleSelectNetworking = () => {
        if (tagFilters.has("networking") && networkingSelected === true) {
            tagFilters.delete("networking");
        } else {
            tagFilters.add("networking");
        }
        setNetworkingSelected(!networkingSelected);
    };

    const handleSelectDatabase = () => {
        if (tagFilters.has("database") && networkingSelected === true) {
            tagFilters.delete("database");
        } else {
            tagFilters.add("database");
        }
        setDatabaseSelected(!networkingSelected);
    };

    const filtered = Object.values(allBlogs).filter((entry) => {

        if (tagFilters.size > 0) {
            if (tagFilters.has(entry.data.ignore)) {
                return entry;
            }
        } else {
            return entry;
        }
    });

    const clearFilters = () => {
        location.reload();
    };

    return (
        <div>
            <div class="my-2 p-10 text-center">
                <h2 class="text-lg italic font-bold">What I'm learning about</h2>
                <div class="mt-5 space-x-5">
                    <Checkbox
                        label="Networking"
                        value={networkingSelected}
                        onChange={handleSelectNetworking}
                    />
                    <Checkbox
                        label="Database"
                        value={databaseSelected}
                        onChange={handleSelectDatabase}
                    />
                    <button
                        class="bg-zinc-500 p-1 hover:bg-zinc-700"
                        onClick={clearFilters}
                    >
                        Clear?
                    </button>
                </div>
                <div class="pt-10">
                    {filtered.map((entry) => (
                        <li class="p-2 underline text-black dark:text-zinc-300">
                            <a href={`/blogs/${entry.slug}`}>{entry.data.title}</a>
                        </li>
                    ))}
                </div>
            </div>
        </div>
    );
}


interface CheckboxProps {
    label: string;
    value: boolean;
    onChange: () => void;
}

const Checkbox = (props: CheckboxProps) => {
    const { label, value, onChange } = props;
    return (
        <label>
            <input type="checkbox" checked={value} onChange={onChange} />
            { } {label}
        </label>
    );
};
