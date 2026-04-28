import type { ReactNode } from "react"

import { ImageIcon, Play } from "lucide-react"
import { useTranslation } from "react-i18next"

import type { SkillContent } from "@/modules/learning-experience/domain/entities/skill-content"

import { cn } from "@/modules/shared/lib/utils"

type BulletContent = NonNullable<SkillContentElement["bullet"]>
type BulletElementProps = {
  data: BulletContent
}

type BulletGroupProps = { bullets: Array<BulletContent> }

type CTAElementProps = {
  data: NonNullable<SkillContent["content"]["elements"][number]["cta"]>
}
type ImageElementProps = {
  data: NonNullable<SkillContent["content"]["elements"][number]["image"]>
}

type SkillContentDisplayProps = { data: SkillContent }

type SkillContentElement = SkillContent["content"]["elements"][number]

type VideoElementProps = {
  data: NonNullable<SkillContent["content"]["elements"][number]["video"]>
}

export function SkillContentDisplay({ data }: SkillContentDisplayProps) {
  const { t } = useTranslation()
  const { content, metadata } = data
  const coverUrlJson = metadata.cover_image.url_json
  const hasVideoElement = content.elements.some(
    (element) => element.kind === "video",
  )

  return (
    <div className="font-outfit text-loops-light flex min-h-screen flex-col items-center bg-[#000016] p-4">
      <div className="flex w-full max-w-md flex-col items-center space-y-4 text-center">
        <h1 className="text-lg font-semibold">
          <span className="text-[#ff4900]">{metadata.category_name}: </span>
          <span>{metadata.title}</span>
        </h1>

        {coverUrlJson && !hasVideoElement && (
          <div className="w-full overflow-hidden rounded-2xl">
            <img
              alt={metadata.cover_image.alt}
              aria-description={metadata.cover_image.description}
              className="h-auto w-full object-cover"
              src={coverUrlJson["100"]}
              title={metadata.cover_image.title}
            />
          </div>
        )}

        {/* Lesson Heading */}
        <div className="text-2xl leading-tight font-semibold">
          <span className="text-[#31bce6]">{t("skill.lesson")}</span>
          <br />
          <span className="text-[#dee2e6]">{content.heading}</span>
        </div>
      </div>

      <div className="mt-10 flex w-full max-w-md flex-col space-y-10">
        {renderSkillElements(content.elements)}
      </div>
    </div>
  )
}

function BulletElement({ data }: BulletElementProps) {
  return (
    <p
      className={cn(
        "text-center text-lg leading-relaxed text-[#dee2e6]",
        data.bold && "font-bold",
        data.italic && "italic",
        data.strike && "line-through",
      )}
      style={{ color: data.color ? data.color : "white" }}
    >
      {data.text}
    </p>
  )
}

function BulletGroup({ bullets }: BulletGroupProps) {
  return (
    <div
      className="w-full rounded-3xl bg-[#15153a]/30 p-6"
      data-testid="skill-bullet-group"
    >
      <div className="flex flex-col gap-4">
        {bullets.map((bullet, index) => (
          <div
            className={cn(index > 0 && "border-t border-white/10 pt-4")}
            data-testid="skill-bullet-item"
            key={`${bullet.text}-${index}`}
          >
            <BulletElement data={bullet} />
          </div>
        ))}
      </div>
    </div>
  )
}

function CTAElement({ data }: CTAElementProps) {
  const mascotUrlJson = data.mascot.url_json

  return (
    <div className="flex w-full items-center justify-between gap-4">
      {mascotUrlJson && (
        <div className="w-1/3 shrink-0">
          <img
            alt="Mascot"
            className="h-auto w-full object-contain"
            src={mascotUrlJson["100"] || Object.values(mascotUrlJson)[0]}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col items-start space-y-2">
        <h4 className="text-2xl font-bold text-[#31bce6]">{data.title}</h4>
        <p className="text-sm leading-relaxed font-semibold text-[#dee2e6]">
          {data.description}
        </p>
      </div>
    </div>
  )
}

function ImageElement({ data }: ImageElementProps) {
  const imageUrlJson = data.url_json

  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#31bce6]/20 bg-[#15153a]/50">
      {imageUrlJson ? (
        <img
          alt={data.alt}
          aria-description={data.description}
          className="h-auto w-full object-contain"
          src={imageUrlJson["100"]}
          title={data.title}
        />
      ) : (
        <div className="relative w-full">
          <div className="aspect-video w-full bg-slate-900 opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#31bce6] shadow-lg">
              <ImageIcon className="text-loops-light" size={32} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function renderSkillElements(elements: ReadonlyArray<SkillContentElement>) {
  const renderedElements: Array<ReactNode> = []
  let pendingBullets: Array<BulletContent> = []
  let bulletGroupIndex = 0

  const flushBulletGroup = () => {
    if (pendingBullets.length === 0) return

    renderedElements.push(
      <BulletGroup
        bullets={pendingBullets}
        key={`bullet-group-${bulletGroupIndex}`}
      />,
    )

    pendingBullets = []
    bulletGroupIndex += 1
  }

  elements.forEach((element, index) => {
    switch (element.kind) {
      case "bullet": {
        if (element.bullet) {
          pendingBullets.push(element.bullet)
        }
        break
      }
      case "cta": {
        flushBulletGroup()

        if (element.cta) {
          renderedElements.push(
            <CTAElement data={element.cta} key={`cta-${index}`} />,
          )
        }
        break
      }
      case "image": {
        flushBulletGroup()

        if (element.image) {
          renderedElements.push(
            <ImageElement data={element.image} key={`image-${index}`} />,
          )
        }
        break
      }
      case "video": {
        flushBulletGroup()

        if (element.video) {
          renderedElements.push(
            <VideoElement data={element.video} key={`video-${index}`} />,
          )
        }
        break
      }
      default:
        break
    }
  })

  flushBulletGroup()

  return renderedElements
}

function VideoElement({ data }: VideoElementProps) {
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split("shorts/")[1]?.split("?")[0] || ""
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  }

  const embedUrl = data.url ? getYouTubeEmbedUrl(data.url) : null

  return (
    <div className="relative flex w-full flex-col items-center space-y-4">
      {/* Divider */}
      <div className="h-px w-3/4 bg-[#ff4900] shadow-[0px_0px_0px_0px_#ff4900]" />

      <div className="group relative w-full max-w-[320px] overflow-hidden rounded-2xl bg-black">
        {embedUrl ? (
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="aspect-[9/16] w-full"
            src={embedUrl}
            title={data.title || "YouTube video player"}
          />
        ) : (
          <>
            <div className="aspect-[9/16] w-full bg-slate-900 opacity-80"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#ff0000] shadow-lg transition-transform group-hover:scale-110">
                <Play className="text-loops-light fill-white" size={32} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="h-px w-3/4 bg-[#ff4900] shadow-[0px_0px_0px_0px_#ff4900]" />
    </div>
  )
}
