import { CategoryIcon } from "@/modules/shared/components/icons/category"
import { FlashIcon } from "@/modules/shared/components/icons/flash"
import { StarIcon } from "@/modules/shared/components/icons/star"
import { UserIcon } from "@/modules/shared/components/icons/user"
import { useTranslation } from "react-i18next"
import { TabItem } from "./tab-item"

export function BottomTabNavigator() {
  const { t } = useTranslation()

  return (
    <div className="mb-4 px-4">
      <div className="relative flex w-full items-start justify-between rounded-xl bg-[rgba(12,20,43,0.8)] bg-[linear-gradient(90deg,rgba(255,255,255,0.2)_0%,rgba(49,188,230,0.2)_100%)] px-8 pb-3 backdrop:blur-[47px]">
        <TabItem label={t("navigation.home")} icon={<CategoryIcon />} href="/" />
        <TabItem
          label={t("navigation.explore")}
          icon={<FlashIcon />}
          href="/explore"
        />
        <TabItem
          label={t("navigation.leaderboard")}
          icon={<StarIcon />}
          href="/leaderboard"
        />
        <TabItem
          label={t("navigation.profile")}
          icon={<UserIcon />}
          href="/profile"
        />
      </div>
    </div>
  )
}

// Export a spacer component to prevent content from being obscured by the tab bar
export function BottomTabSpacer() {
  return <div className="h-24" />
}
