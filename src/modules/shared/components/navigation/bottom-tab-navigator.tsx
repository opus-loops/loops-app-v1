import { useTranslation } from "react-i18next"

import { TabItem } from "./tab-item"
import { CategoryIcon } from "@/modules/shared/components/icons/category"
import { FlashIcon } from "@/modules/shared/components/icons/flash"
import { StarIcon } from "@/modules/shared/components/icons/star"
import { UserIcon } from "@/modules/shared/components/icons/user"

export function BottomTabNavigator() {
  const { t } = useTranslation()

  return (
    <div className="mb-4 px-4">
      <div className="relative flex w-full items-start justify-between rounded-xl bg-[rgba(12,20,43,0.8)] bg-[linear-gradient(90deg,rgba(255,255,255,0.2)_0%,rgba(49,188,230,0.2)_100%)] px-8 pb-3 backdrop:blur-[47px]">
        <TabItem
          href="/"
          icon={<CategoryIcon />}
          label={t("navigation.home")}
        />
        <TabItem
          href="/explore"
          icon={<FlashIcon />}
          label={t("navigation.explore")}
        />
        <TabItem
          href="/leaderboard"
          icon={<StarIcon />}
          label={t("navigation.leaderboard")}
        />
        <TabItem
          href="/profile"
          icon={<UserIcon />}
          label={t("navigation.profile")}
        />
      </div>
    </div>
  )
}

// Export a spacer component to prevent content from being obscured by the tab bar
export function BottomTabSpacer() {
  return <div className="h-24" />
}
