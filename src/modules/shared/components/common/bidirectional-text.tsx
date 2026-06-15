type BidirectionalTextProps = {
  text: string
}

type TextSegment = {
  direction: "ltr" | "neutral"
  text: string
}

const ltrFragmentPattern =
  /https?:\/\/[^\s<>"']+|<\/?[A-Za-z][^<>]*>?|[A-Za-z0-9_$][A-Za-z0-9_$./:#?=&%+\-'"()[\]{}<>]*/g

export function BidirectionalText({ text }: BidirectionalTextProps) {
  return splitBidirectionalText(text).map((segment, index) => {
    if (segment.direction === "neutral") return segment.text

    return (
      <span
        dir="ltr"
        key={`${segment.text}-${index}`}
        style={{ unicodeBidi: "isolate" }}
      >
        {segment.text}
      </span>
    )
  })
}

function splitBidirectionalText(text: string): Array<TextSegment> {
  const segments: Array<TextSegment> = []
  let previousIndex = 0

  ltrFragmentPattern.lastIndex = 0

  for (const match of text.matchAll(ltrFragmentPattern)) {
    const matchedText = match[0]
    const matchIndex = match.index

    if (matchIndex > previousIndex) {
      segments.push({
        direction: "neutral",
        text: text.slice(previousIndex, matchIndex),
      })
    }

    segments.push({ direction: "ltr", text: matchedText })
    previousIndex = matchIndex + matchedText.length
  }

  if (previousIndex < text.length) {
    segments.push({ direction: "neutral", text: text.slice(previousIndex) })
  }

  return segments
}
