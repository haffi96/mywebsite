import { useEffect, useState } from "preact/hooks";
import PocketBase from "pocketbase";
import type { Record, ListResult } from "pocketbase";

interface BlogMetricsProps {
    blog_data: {
        name: string;
    };
    pb_url: string;
}

export default function BlogMetrics(props: BlogMetricsProps) {

    const { name } = props.blog_data;
    const { pb_url } = props;

    const pb_client = new PocketBase(pb_url);

    const [like_count, setLikes] = useState(0);
    const [view_count, setViews] = useState(0);
    const [blogId, setBlogId] = useState<string | undefined>(undefined);

    const incrementLikesForBlogId = async (new_like_count: number) => {
        await pb_client.collection("blog").update(blogId!, {
            likes: new_like_count,
        });
    };

    const incrementViewsForBlogId = async (new_view_count: number) => {
        await pb_client.collection("blog").update(blogId!, {
            views: new_view_count,
        });
    };

    const handleLikeClick = async () => {
        const new_like_count = like_count + 1;
        await incrementLikesForBlogId(new_like_count);
        setLikes(new_like_count);
    };

    useEffect(() => {

        const fetchBlogRecord = async () => {
            return await pb_client
                .collection("blog")
                .getList(1, 1, { filter: `slug='${name}'` });
        }

        const upsertRecord = async (record: ListResult<Record>) => {
            if (record.items.length === 0) {
                // Create record
                const new_blog_data = {
                    slug: name,
                    likes: like_count,
                    view_count: view_count,
                };
                const new_record = await pb_client.collection("blog").create(new_blog_data);
                setBlogId(new_record.id);
            } else {
                setBlogId(record.items[0].id);
                setLikes(record.items[0].likes);
                setViews(record.items[0].views);
            }
        }

        // Increment only when blogId present
        if (blogId) {
            const new_view_count = view_count + 1;
            incrementViewsForBlogId(new_view_count);
            setViews(new_view_count);
        } else {
            fetchBlogRecord().then((record) => upsertRecord(record));
        }
    }, [blogId]);

    return (
        <div class="flex my-2 w-auto space-x-5">
            <div class="flex flex-row space-x-1">
                <svg class="fill-white hover:fill-zinc-500 stroke-black stroke-2 w-5 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div class="py-2 text-black dark:text-white">{view_count} views</div>
            </div>
            <div class="flex flex-row space-x-1">
                <button onClick={handleLikeClick}>
                    <svg
                        class="fill-white hover:fill-zinc-500 stroke-black stroke-2 w-5 h-8"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                    </svg>
                </button>
                <div class="py-2 text-black dark:text-white">{like_count} likes</div>
            </div>
        </div>
    );
}
