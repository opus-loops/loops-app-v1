import { SkillContent } from "@/modules/learning-experience/domain/entities/skill-content"
import { cn } from "@/modules/shared/lib/utils"
import { ImageIcon, Play } from "lucide-react"

type SkillContentDisplayProps = { data: SkillContent }
export function SkillContentDisplay({ data }: SkillContentDisplayProps) {
  const { metadata, content } = data
  const coverUrlJson = metadata.cover_image?.url_json

  return (
    <div className="font-outfit text-loops-light flex min-h-screen flex-col items-center bg-[#000016] p-4">
      <div className="flex w-full max-w-md flex-col items-center space-y-4 text-center">
        <h1 className="text-lg font-semibold">
          <span className="text-[#ff4900]">{metadata.category_name}: </span>
          <span>{metadata.title}</span>
        </h1>

        {coverUrlJson && (
          <div className="w-full overflow-hidden rounded-2xl">
            <img
              src={coverUrlJson["20"]}
              alt={metadata.cover_image.alt}
              aria-description={metadata.cover_image.description}
              title={metadata.cover_image.title}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        {/* Lesson Heading */}
        <div className="text-2xl leading-tight font-semibold">
          <span className="text-[#31bce6]">Lesson:</span>
          <br />
          <span className="text-[#dee2e6]">{content.heading}</span>
        </div>
      </div>

      <div className="mt-10 flex w-full max-w-md flex-col space-y-10">
        {content.elements.map((element, index) => {
          switch (element.kind) {
            case "bullet":
              return (
                <BulletElement
                  key={index}
                  data={element.bullet!}
                  index={index}
                />
              )
            case "image":
              return <ImageElement key={index} data={element.image!} />
            case "video":
              return <VideoElement key={index} data={element.video!} />
            case "cta":
              return <CTAElement key={index} data={element.cta!} />
            default:
              return null
          }
        })}
      </div>
    </div>
  )
}

type BulletElementProps = {
  data: NonNullable<SkillContent["content"]["elements"][number]["bullet"]>
  index: number
}

function BulletElement({ data, index }: BulletElementProps) {
  const isEven = index % 2 === 0

  return (
    <div
      className={cn(
        "flex w-full items-center justify-center rounded-lg bg-[#15153a] p-6 shadow-[0px_4px_0px_0px_#ff4900]",
        isEven ? "w-11/12 self-start" : "w-11/12 self-end",
      )}
    >
      <p
        className={cn(
          "text-center text-lg leading-relaxed text-[#dee2e6]",
          data.bold && "font-bold",
          data.italic && "italic",
          data.strike && "line-through",
        )}
        style={{
          color: data.color ? data.color : "white",
        }}
      >
        {data.text}
      </p>
    </div>
  )
}

type ImageElementProps = {
  data: NonNullable<SkillContent["content"]["elements"][number]["image"]>
}

function ImageElement({ data }: ImageElementProps) {
  const imageUrlJson = data.url_json

  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#31bce6]/20 bg-[#15153a]/50">
      {imageUrlJson ? (
        <img
          src={imageUrlJson["20"]}
          alt={data.alt}
          aria-description={data.description}
          title={data.title}
          className="h-auto w-full object-contain"
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

type VideoElementProps = {
  data: NonNullable<SkillContent["content"]["elements"][number]["video"]>
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
            src={embedUrl}
            title={data.title || "YouTube video player"}
            className="aspect-[9/16] w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
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

type CTAElementProps = {
  data: NonNullable<SkillContent["content"]["elements"][number]["cta"]>
}

function CTAElement({ data }: CTAElementProps) {
  const mascotUrlJson = data.mascot.url_json

  return (
    <div className="flex w-full items-center justify-between gap-4">
      {mascotUrlJson && (
        <div className="w-1/3 shrink-0">
          <img
            src={mascotUrlJson["20"] || Object.values(mascotUrlJson)[0]}
            alt="Mascot"
            className="h-auto w-full object-contain"
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
