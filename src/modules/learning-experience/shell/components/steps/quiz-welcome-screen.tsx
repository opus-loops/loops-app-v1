import { HalfStarIcon } from "@/modules/shared/components/icons/half-star"
import { NoteIcon } from "@/modules/shared/components/icons/note"
import { TimerIcon } from "@/modules/shared/components/icons/timer"
import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { QuizActionButton } from "../quiz-action-button"

type QuizWelcomeScreenProps = {
  quizItem: CategoryContentItem & { contentType: "quizzes" }
}

export function QuizWelcomeScreen({ quizItem }: QuizWelcomeScreenProps) {
  return (
    <div className="font-outfit bg-loops-background relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute top-1/2 -left-px z-0 h-[592px] w-[459px] -translate-y-1/2 opacity-50">
        <img
          src="/assets/svg/doodle.svg"
          alt="Background Doodle"
          className="h-full w-full"
        />
      </div>

      <div className="border-loops-cyan bg-loops-background relative z-10 flex w-11/12 flex-col items-center space-y-8 rounded-lg border px-2 py-4">
        <h1 className="font-outfit text-loops-light text-center text-xl font-bold tracking-tight">
          {quizItem.content.label[0].content}
        </h1>

        <div className="relative h-55 w-82">
          <img
            src="/assets/images/racing-loops.png"
            alt="Racing Loops Mascot"
            className="h-full w-full object-contain"
          />
        </div>

        <div className="flex w-full items-end justify-center gap-x-8 px-2">
          <div className="flex flex-col items-center gap-2">
            <div className="text-loops-cyan h-6 w-6">
              <NoteIcon />
            </div>
            <div className="text-center">
              <p className="text-loops-cyan text-[20px] font-semibold">
                {quizItem.content.questionsCount}
              </p>
              <p className="text-loops-cyan text-[16px]">Quizzes</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-loops-label-xp h-6 w-6">
              <HalfStarIcon />
            </div>
            <div className="text-center">
              <p className="text-loops-label-xp text-[20px] font-semibold">
                {quizItem.content.score}
              </p>
              <p className="text-loops-label-xp text-[16px]">XP</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-loops-orange h-6 w-6">
              <TimerIcon />
            </div>
            <div className="text-center">
              <p className="text-loops-orange text-[20px] font-semibold">
                {quizItem.content.totalTime}
              </p>
              <p className="text-loops-orange text-[16px]">Time</p>
            </div>
          </div>
        </div>

        <div className="w-full px-4">
          <QuizActionButton quizItem={quizItem} />
        </div>
      </div>
    </div>
  )
}
