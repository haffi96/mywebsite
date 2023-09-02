import { z, defineCollection } from "astro:content";

export const blogsCollectionSchema = z.object({
    title: z.string(),
    rank: z.number(),
    category: z.string(),
    name: z.string(),
    ignore: z.boolean().optional(),
    })

export const blogsCollection = defineCollection({
    type: 'content',
    schema: blogsCollectionSchema,
    }
);

export const projectsCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
      title: z.string(),
      rank: z.number(),
      preview: image(),
      techstack: z.string(),
      site: z.string().optional(),
      githublink1: z.string(),
      githublink2: z.string().optional(),
      }),
    }
);
// Export a single `collections` object to register your collection(s)
export const collections = {
  blogs: blogsCollection,
  projects: projectsCollection,
};