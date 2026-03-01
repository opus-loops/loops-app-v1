import { Pencil, Trash2, User2 } from "lucide-react"
import { type RefObject } from "react"

type AvatarUploadProps = {
  displayedAvatarUrl: string | null | undefined
  hasNewAvatar: boolean
  fullName: string
  onFileSelect: (file: File) => void
  onRemove: () => void
  fileInputRef: RefObject<HTMLInputElement | null>
}

export function AvatarUpload({
  displayedAvatarUrl,
  hasNewAvatar,
  fullName,
  onFileSelect,
  onRemove,
  fileInputRef,
}: AvatarUploadProps) {
  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="focus-visible:ring-loops-cyan relative h-24 w-24 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#000016]"
        aria-label="Change avatar"
      >
        {displayedAvatarUrl ? (
          <img
            src={displayedAvatarUrl}
            alt={fullName}
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="bg-loops-pink flex h-24 w-24 items-center justify-center rounded-full">
            <User2 className="text-loops-light h-10 w-10" />
          </div>
        )}

        <span className="bg-loops-light absolute right-0 bottom-0 inline-flex h-8 w-8 items-center justify-center rounded-full shadow-md">
          <Pencil className="h-4 w-4 text-[#000016]" />
        </span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return
          onFileSelect(file)
        }}
      />

      {hasNewAvatar ? (
        <button
          type="button"
          onClick={() => {
            onRemove()
            if (fileInputRef.current) fileInputRef.current.value = ""
          }}
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#ff3b3b]"
          aria-label="Remove selected avatar"
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </button>
      ) : null}
    </div>
  )
}
