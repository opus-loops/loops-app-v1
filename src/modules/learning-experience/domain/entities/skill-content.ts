import { Schema } from "effect"

// --- Shared Value Objects ---

const imageUrlsSchema = Schema.Struct({
  100: Schema.String,
  80: Schema.String,
  60: Schema.String,
  40: Schema.String,
  20: Schema.String,
})

const contentImageSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.String,
  alt: Schema.String,
  code: Schema.String,
  url_json: Schema.optional(imageUrlsSchema),
})

const contentVideoSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.String,
  alt: Schema.String,
  code: Schema.String,
  url: Schema.String,
})

const formattedTextSchema = Schema.Struct({
  text: Schema.String,
  bold: Schema.NullOr(Schema.Boolean),
  italic: Schema.NullOr(Schema.Boolean),
  strike: Schema.NullOr(Schema.Boolean),
  color: Schema.NullOr(Schema.String),
})

// --- Metadata Schema ---

const metadataSchema = Schema.Struct({
  slug: Schema.String,
  title: Schema.String,
  language: Schema.String,
  cover_image: contentImageSchema,
  abilities: Schema.Array(Schema.String),
  category_name: Schema.String,
  content_type: Schema.String,
  item_order: Schema.Number,
  item_type: Schema.String,
  contains_code_example: Schema.String,
  contains_video: Schema.String,
  contains_images: Schema.String,
  objectives: Schema.String,
})

// --- Content Elements Schema ---

const bulletSchema = Schema.Struct({
  text: Schema.String,
  bold: Schema.NullOr(Schema.Boolean),
  italic: Schema.NullOr(Schema.Boolean),
  strike: Schema.NullOr(Schema.Boolean),
  color: Schema.NullOr(Schema.String),
})

const ctaSchema = Schema.Struct({
  mascot: Schema.Struct({
    code: Schema.String,
    url_json: Schema.optional(imageUrlsSchema),
  }),
  title: Schema.String,
  description: Schema.String,
  formatted_title: Schema.Array(formattedTextSchema),
  formatted_description: Schema.Array(formattedTextSchema),
})

const elementSchema = Schema.Struct({
  kind: Schema.Literal("bullet", "image", "video", "cta"),
  bullet: Schema.NullOr(bulletSchema),
  image: Schema.NullOr(contentImageSchema),
  video: Schema.NullOr(contentVideoSchema),
  cta: Schema.NullOr(ctaSchema),
})

const contentBodySchema = Schema.Struct({
  heading: Schema.String,
  elements: Schema.Array(elementSchema),
})

// --- Main Schema ---

export const skillContentSchema = Schema.Struct({
  metadata: metadataSchema,
  content: contentBodySchema,
})

export type SkillContent = typeof skillContentSchema.Type
