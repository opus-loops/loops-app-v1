import { Button } from "@/modules/shared/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { useGoogleLogin } from "../services/use-google-login"

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: IdConfiguration) => void
          renderButton: (
            element: HTMLElement,
            config: GsiButtonConfiguration,
          ) => void
          prompt: (
            momentListener?: (notification: PromptMomentNotification) => void,
          ) => void
          disableAutoSelect: () => void
          storeCredential: (
            credential: { id: string; password: string },
            callback?: () => void,
          ) => void
          cancel: () => void
          onGoogleLibraryLoad: () => void
          revoke: (
            hint: string,
            callback: (done: RevocationResponse) => void,
          ) => void
        }
      }
    }
  }
}

// Types based on official Google Identity Services documentation
interface IdConfiguration {
  client_id: string
  auto_select?: boolean
  callback?: (credentialResponse: CredentialResponse) => void
  login_uri?: string
  native_callback?: (response: { id: string; password: string }) => void
  cancel_on_tap_outside?: boolean
  prompt_parent_id?: string
  nonce?: string
  context?: "signin" | "signup" | "use"
  state_cookie_domain?: string
  ux_mode?: "popup" | "redirect"
  allowed_parent_origin?: string | string[]
  intermediate_iframe_close_callback?: () => void
  itp_support?: boolean
  login_hint?: string
  hd?: string
  use_fedcm_for_prompt?: boolean
}

interface CredentialResponse {
  credential: string
  select_by:
    | "auto"
    | "user"
    | "user_1tap"
    | "user_2tap"
    | "btn"
    | "btn_confirm"
    | "btn_add_session"
    | "btn_confirm_add_session"
  clientId?: string
}

interface GsiButtonConfiguration {
  type?: "standard" | "icon"
  theme?: "outline" | "filled_blue" | "filled_black"
  size?: "large" | "medium" | "small"
  text?: "signin_with" | "signup_with" | "continue_with" | "signin"
  shape?: "rectangular" | "pill" | "circle" | "square"
  logo_alignment?: "left" | "center"
  width?: string | number
  locale?: string
  click_listener?: () => void
}

interface PromptMomentNotification {
  isNotDisplayed: () => boolean
  isSkippedMoment: () => boolean
  isDismissedMoment: () => boolean
  getNotDisplayedReason: () =>
    | "browser_not_supported"
    | "invalid_client"
    | "missing_client_id"
    | "opt_out_or_no_session"
    | "secure_http_required"
    | "suppressed_by_user"
    | "unregistered_origin"
    | "unknown_reason"
  isDisplayed: () => boolean
  isDisplayMoment: () => boolean
  getSkippedReason: () =>
    | "auto_cancel"
    | "user_cancel"
    | "tap_outside"
    | "issuing_failed"
  getDismissedReason: () =>
    | "credential_returned"
    | "cancel_called"
    | "flow_restarted"
  getMomentType: () => "display" | "skipped" | "dismissed"
}

interface RevocationResponse {
  successful: boolean
  error?: string
}

export function LoginGoogle() {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const { handleGoogleLogin } = useGoogleLogin()

  useEffect(() => {
    const checkGoogleLoaded = () => {
      if (window.google?.accounts?.id) {
        setIsGoogleLoaded(true)
        initializeGoogle()
      } else setTimeout(checkGoogleLoaded, 100)
    }

    checkGoogleLoaded()
  }, [])

  const initializeGoogle = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
      context: "signin",
      ux_mode: "popup",
      use_fedcm_for_prompt: false,
    })
  }

  // TODO: handle api response
  const handleCredentialResponse = async (response: CredentialResponse) => {
    const googleToken = response.credential
    await handleGoogleLogin(googleToken)
  }

  const handleGoogleSignIn = () => {
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        const reason = notification.getNotDisplayedReason()

        if (reason === "browser_not_supported")
          toast.error("Your browser doesn't support Google Sign-In.")
        else if (reason === "invalid_client" || reason === "missing_client_id")
          toast.error("Google Sign-In is not properly configured.")
        else if (reason === "opt_out_or_no_session")
          toast.info("Please sign in to your Google account first.")
        else if (reason === "secure_http_required")
          toast.error("Google Sign-In requires a secure connection (HTTPS).")
        else if (reason === "suppressed_by_user")
          toast.info("Google Sign-In was disabled by user preference.")
        else if (reason === "unregistered_origin")
          toast.error("This domain is not authorized for Google Sign-In.")
        else toast.error("Google Sign-In is not available right now.")
      }
    })
  }

  return (
    <Button
      className="font-outfit text-loops-text hover:bg-loops-google/80 bg-loops-google w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none"
      type="button"
      ref={buttonRef}
      disabled={!isGoogleLoaded}
      onClick={handleGoogleSignIn}
    >
      <svg
        fill="none"
        height={30}
        viewBox="0 0 25 24"
        width={31}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.3055 10.0415H21.5V10H12.5V14H18.1515C17.327 16.3285 15.1115 18 12.5 18C9.1865 18 6.5 15.3135 6.5 12C6.5 8.6865 9.1865 6 12.5 6C14.0295 6 15.421 6.577 16.4805 7.5195L19.309 4.691C17.523 3.0265 15.134 2 12.5 2C6.9775 2 2.5 6.4775 2.5 12C2.5 17.5225 6.9775 22 12.5 22C18.0225 22 22.5 17.5225 22.5 12C22.5 11.3295 22.431 10.675 22.3055 10.0415Z"
          fill="#FFC107"
        />
        <path
          d="M3.65295 7.3455L6.93845 9.755C7.82745 7.554 9.98045 6 12.5 6C14.0295 6 15.421 6.577 16.4805 7.5195L19.309 4.691C17.523 3.0265 15.134 2 12.5 2C8.65895 2 5.32795 4.1685 3.65295 7.3455Z"
          fill="#FF3D00"
        />
        <path
          d="M12.5 22C15.083 22 17.43 21.0115 19.2045 19.404L16.1095 16.785C15.0718 17.5742 13.8038 18.001 12.5 18C9.89903 18 7.69053 16.3415 6.85853 14.027L3.59753 16.5395C5.25253 19.778 8.61353 22 12.5 22Z"
          fill="#4CAF50"
        />
        <path
          d="M22.3055 10.0415H21.5V10H12.5V14H18.1515C17.7571 15.1082 17.0467 16.0766 16.108 16.7855L16.1095 16.7845L19.2045 19.4035C18.9855 19.6025 22.5 17 22.5 12C22.5 11.3295 22.431 10.675 22.3055 10.0415Z"
          fill="#1976D2"
        />
      </svg>
      Login with Google
    </Button>
  )
}
