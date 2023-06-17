import { useState } from "preact/hooks";

export default function BlogView(props) {
  const blogs = props.blogs;

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

  const filtered = blogs.filter((blog) => {
    if (tagFilters.size > 0) {
      if (tagFilters.has(blog.frontmatter.category)) {
        return blog;
      }
    } else {
      return blog;
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
          {filtered.map((blog) => (
            <li class="p-2 underline text-black dark:text-zinc-300">
              <a href={blog.url}>{blog.frontmatter.title}</a>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
}

const Checkbox = ({ label, value, onChange }) => {
  return (
    <label>
      <input type="checkbox" checked={value} onChange={onChange} />
      {} {label}
    </label>
  );
};
