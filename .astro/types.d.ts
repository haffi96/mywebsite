declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;
	export type CollectionEntry<C extends keyof AnyEntryMap> = Flatten<AnyEntryMap[C]>;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blogs": {
"15-cap-theorem.mdx": {
	id: "15-cap-theorem.mdx";
  slug: "15-cap-theorem";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"20-threads-and-processes.mdx": {
	id: "20-threads-and-processes.mdx";
  slug: "20-threads-and-processes";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"4-supabase-function.mdx": {
	id: "4-supabase-function.mdx";
  slug: "4-supabase-function";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"5-test-github-actions.mdx": {
	id: "5-test-github-actions.mdx";
  slug: "5-test-github-actions";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"6-tcp-vs-udp.mdx": {
	id: "6-tcp-vs-udp.mdx";
  slug: "6-tcp-vs-udp";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"7-osi-model.mdx": {
	id: "7-osi-model.mdx";
  slug: "7-osi-model";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"8-load-balancing.mdx": {
	id: "8-load-balancing.mdx";
  slug: "8-load-balancing";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"9-trees.mdx": {
	id: "9-trees.mdx";
  slug: "9-trees";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"SSRwithNextJS13.mdx": {
	id: "SSRwithNextJS13.mdx";
  slug: "ssrwithnextjs13";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"automating-with-ansible.mdx": {
	id: "automating-with-ansible.mdx";
  slug: "automating-with-ansible";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"database-table-partitioning.mdx": {
	id: "database-table-partitioning.mdx";
  slug: "database-table-partitioning";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"database-transaction-isolation.mdx": {
	id: "database-transaction-isolation.mdx";
  slug: "database-transaction-isolation";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"graph-traversal.mdx": {
	id: "graph-traversal.mdx";
  slug: "graph-traversal";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"journey-of-a-request.mdx": {
	id: "journey-of-a-request.mdx";
  slug: "journey-of-a-request";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"linux-dirs.mdx": {
	id: "linux-dirs.mdx";
  slug: "linux-dirs";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"lru-cache.mdx": {
	id: "lru-cache.mdx";
  slug: "lru-cache";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"router-switch.mdx": {
	id: "router-switch.mdx";
  slug: "router-switch";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"sorting-algo.mdx": {
	id: "sorting-algo.mdx";
  slug: "sorting-algo";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"sql-vs-nosql.mdx": {
	id: "sql-vs-nosql.mdx";
  slug: "sql-vs-nosql";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
"types-of-proxies.mdx": {
	id: "types-of-proxies.mdx";
  slug: "types-of-proxies";
  body: string;
  collection: "blogs";
  data: InferEntrySchema<"blogs">
} & { render(): Render[".mdx"] };
};
"projects": {
"encapsulate.mdx": {
	id: "encapsulate.mdx";
  slug: "encapsulate";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".mdx"] };
"quiz-app-builder.mdx": {
	id: "quiz-app-builder.mdx";
  slug: "quiz-app-builder";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".mdx"] };
"streetfighter.mdx": {
	id: "streetfighter.mdx";
  slug: "streetfighter";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
