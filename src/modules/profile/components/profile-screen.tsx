import { Link } from "@tanstack/react-router"
import { Trophy } from "lucide-react"
import { useMemo } from "react"

import loopsBgUrl from "../../../../assets/images/loops-bg.png"
import type { User } from "@/modules/shared/domain/entities/user"

import { GearIcon } from "@/modules/shared/components/icons/gear"
import { HalfStarIcon } from "@/modules/shared/components/icons/half-star"
import { UserIcon } from "@/modules/shared/components/icons/user"
import { OpenCategoriesButton } from "@/modules/shared/components/navigation/open-categories-button"

type ProfileProgressSectionProps = {
  user: User
}

export function ProfileScreen({ user }: ProfileProgressSectionProps) {
  const { globalXp, level, levelProgressPercent } = useMemo(() => {
    const safeXp = Number.isFinite(user.globalXP) ? user.globalXP : 0
    const computedLevel = Math.max(1, Math.floor(safeXp / 100) + 1)
    const computedProgress = ((safeXp % 100) + 100) % 100
    return {
      globalXp: safeXp,
      level: computedLevel,
      levelProgressPercent: computedProgress,
    }
  }, [user.globalXP])

  return (
    <div className="bg-loops-background w-full">
      <div className="mx-auto w-full max-w-sm">
        <div className="relative h-96 overflow-hidden">
          <img
            className="absolute inset-0 h-full w-full object-cover object-center"
            src={loopsBgUrl}
          />

          <div className="to-loops-background from-loops-black absolute inset-0 bg-gradient-to-b via-transparent" />

          <div className="relative z-10 px-5 pt-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <OpenCategoriesButton
                  className="h-11 w-11 rounded-xl bg-[#1f4b6682] shadow-lg backdrop-blur-sm hover:bg-[#1f4b66aa]"
                  search={{ category: "all" }}
                  to="/profile"
                />
              </div>

              <div className="bg-loops-background flex items-center gap-1 rounded-lg px-3 py-2">
                <Trophy className="text-loops-label-xp h-4 w-4 shrink-0" />
                <span className="text-loops-light shrink-0 text-xs font-medium">
                  Level {level}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Link
                  className="h-11 w-11 rounded-xl bg-[#1f4b6682] p-2.5 text-[#31BCE6] shadow-lg backdrop-blur-sm transition-colors hover:bg-[#1f4b66aa]"
                  to="/profile/settings"
                >
                  <GearIcon />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative -mt-28 mb-28 px-4">
          <div className="bg-loops-background flex flex-col gap-5 rounded-3xl px-3 py-6">
            {user.avatarURL ? (
              <img
                alt={user.fullName}
                className="mx-auto h-20 w-20 rounded-full border-2 border-white object-cover"
                src={user.avatarURL}
              />
            ) : (
              <div className="bg-loops-pink mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-white">
                <div className="text-loops-light h-10 w-10">
                  <UserIcon />
                </div>
              </div>
            )}

            <p className="text-loops-pink text-center text-2xl font-semibold">
              {user.fullName}
            </p>

            <div className="flex justify-center">
              <div className="rounded-lg bg-[#15153a] px-16 py-2">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 text-[#ffcc00]">
                    <HalfStarIcon />
                  </div>
                  <p className="text-sm font-semibold text-[#ffcc00]">
                    {globalXp} XP
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-end justify-between px-1">
                <span className="text-loops-orange text-sm font-bold">
                  Level {level}
                </span>
                <span className="text-loops-orange text-base font-bold">
                  {levelProgressPercent}%
                </span>
              </div>

              <div className="bg-loops-black h-3 w-full rounded-full">
                <div
                  className="bg-loops-orange h-full rounded-full transition-all duration-500"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
