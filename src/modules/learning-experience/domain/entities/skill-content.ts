import { Schema } from "effect"

// --- Shared Value Objects ---

const imageUrlsSchema = Schema.Struct({
  100: Schema.String,
  20: Schema.String,
  40: Schema.String,
  60: Schema.String,
  80: Schema.String,
})

const contentImageSchema = Schema.Struct({
  alt: Schema.String,
  code: Schema.String,
  description: Schema.String,
  title: Schema.String,
  url_json: Schema.optional(imageUrlsSchema),
})

const contentVideoSchema = Schema.Struct({
  alt: Schema.String,
  code: Schema.String,
  description: Schema.String,
  title: Schema.String,
  url: Schema.String,
})

const formattedTextSchema = Schema.Struct({
  bold: Schema.NullOr(Schema.Boolean),
  color: Schema.NullOr(Schema.String),
  italic: Schema.NullOr(Schema.Boolean),
  strike: Schema.NullOr(Schema.Boolean),
  text: Schema.String,
})

// --- Metadata Schema ---

const metadataSchema = Schema.Struct({
  abilities: Schema.Array(Schema.String),
  category_name: Schema.String,
  contains_code_example: Schema.String,
  contains_images: Schema.String,
  contains_video: Schema.String,
  content_type: Schema.String,
  cover_image: contentImageSchema,
  item_order: Schema.Number,
  item_type: Schema.String,
  language: Schema.String,
  objectives: Schema.String,
  slug: Schema.String,
  title: Schema.String,
})

// --- Content Elements Schema ---

const bulletSchema = Schema.Struct({
  bold: Schema.NullOr(Schema.Boolean),
  color: Schema.NullOr(Schema.String),
  italic: Schema.NullOr(Schema.Boolean),
  strike: Schema.NullOr(Schema.Boolean),
  text: Schema.String,
})

const ctaSchema = Schema.Struct({
  description: Schema.String,
  formatted_description: Schema.Array(formattedTextSchema),
  formatted_title: Schema.Array(formattedTextSchema),
  mascot: Schema.Struct({
    code: Schema.String,
    url_json: Schema.optional(imageUrlsSchema),
  }),
  title: Schema.String,
})

const elementSchema = Schema.Struct({
  bullet: Schema.NullOr(bulletSchema),
  cta: Schema.NullOr(ctaSchema),
  image: Schema.NullOr(contentImageSchema),
  kind: Schema.Literal("bullet", "image", "video", "cta"),
  video: Schema.NullOr(contentVideoSchema),
})

const contentBodySchema = Schema.Struct({
  elements: Schema.Array(elementSchema),
  heading: Schema.String,
})

// --- Main Schema ---

export const skillContentSchema = Schema.Struct({
  content: contentBodySchema,
  metadata: metadataSchema,
})

export type SkillContent = typeof skillContentSchema.Type
