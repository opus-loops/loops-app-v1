# Graph Report - loops-app-v1  (2026-07-13)

## Corpus Check
- 456 files · ~1,817,770 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2202 nodes · 5208 edges · 109 communities (100 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8d5ddc3e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 100|Community 100]]
- [[_COMMUNITY_Community 103|Community 103]]
- [[_COMMUNITY_Community 104|Community 104]]
- [[_COMMUNITY_Community 112|Community 112]]
- [[_COMMUNITY_Community 113|Community 113]]
- [[_COMMUNITY_Community 116|Community 116]]
- [[_COMMUNITY_Community 117|Community 117]]
- [[_COMMUNITY_Community 119|Community 119]]

## God Nodes (most connected - your core abstractions)
1. `instanceFactory()` - 91 edges
2. `parseApiResponse()` - 87 edges
3. `parseEffectSchema()` - 82 edges
4. `cn()` - 77 edges
5. `CategoryContentItem` - 65 edges
6. `useGlobalError()` - 47 edges
7. `internalErrorSchema` - 44 edges
8. `resourceAccessForbiddenErrorSchema` - 44 edges
9. `invalidInputFactory()` - 44 edges
10. `UseCaseErrorSchema` - 43 edges

## Surprising Connections (you probably didn't know these)
- `BulletElement()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/skill-json.tsx → src/modules/shared/lib/utils.ts
- `CountdownTimer()` --calls--> `formatTime()`  [INFERRED]
  src/modules/shared/components/common/countdown-timer.tsx → src/modules/learning-experience/shell/components/steps/quiz-statistics-screen.tsx
- `DialogFooter()` --calls--> `cn()`  [EXTRACTED]
  src/modules/shared/components/ui/dialog.tsx → src/modules/shared/lib/utils.ts
- `createBrowserSessionId()` --calls--> `hasCryptoRandomUuid()`  [INFERRED]
  src/modules/shared/telemetry/browser-session.ts → src/modules/shared/telemetry/runtime.ts
- `fetch()` --calls--> `handleInstrumentedRequest()`  [EXTRACTED]
  src/entry-server.tsx → src/server/telemetry/request.ts

## Import Cycles
- 1-file cycle: `src/server/telemetry/effect.ts -> src/server/telemetry/effect.ts`
- 1-file cycle: `src/server/telemetry/browser-session.ts -> src/server/telemetry/browser-session.ts`
- 3-file cycle: `src/routeTree.gen.ts -> src/routes/__root.tsx -> src/router.tsx -> src/routeTree.gen.ts`

## Communities (109 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (37): useQuizStepper(), useSelectedSubQuiz(), CompletedChoiceQuestion, completedChoiceQuestionSchema, CompletedSequenceOrder, completedSequenceOrderSchema, ChoiceQuestionNavigationManager, SequenceOrderNavigationManager (+29 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (53): StartChoiceQuestionArgs, startChoiceQuestionArgsSchema, StartChoiceQuestionErrors, StartChoiceQuestionExit, startChoiceQuestionExitSchema, StartChoiceQuestionResult, StartChoiceQuestionSuccess, ValidateChoiceQuestionArgs (+45 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (32): ConfirmAccountArgs, confirmAccountArgsSchema, ConfirmAccountErrors, confirmAccountExitSchema, ConfirmAccountResult, ConfirmAccountSuccess, ExpiredInvalidCodeError, expiredInvalidCodeErrorSchema (+24 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (14): CategoryDetails(), CategoryDetailsWrapper(), CategoryDetailsWrapperProps, CategoryItemCircle(), CategoryMapping(), ContentListWrapper(), ContentListWrapperProps, HomeScreen() (+6 more)

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (16): ConfirmAccountDialog(), ConfirmAccountDialogProps, FreeTrialDialogStep, VoucherStepperDialog(), VoucherStepperDialogProps, VoucherStepperSelectionStep(), VoucherStepperSelectionStepProps, useStartCategory() (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (38): getExploreCategoryFactory(), ListExploreCategoriesErrors, listExploreCategoriesErrorsSchema, listExploreCategoriesExitSchema, listExploreCategoriesFactory(), ListExploreCategoriesQuery, listExploreCategoriesQuerySchema, ListExploreCategoriesResult (+30 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (38): devDependencies, esbuild, eslint, eslint-config-prettier, @eslint/css, @eslint/js, @eslint/json, @eslint/markdown (+30 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (30): Route, Route, Route, Route, Route, Route, Route, Route (+22 more)

### Community 8 - "Community 8"
Cohesion: 0.04
Nodes (56): LogoutArgs, logoutArgsSchema, LogoutErrors, LogoutResult, LogoutSuccess, GetExploreCategoryArgs, getExploreCategoryArgsSchema, GetExploreCategoryErrors (+48 more)

### Community 9 - "Community 9"
Cohesion: 0.08
Nodes (24): RequestConfirmErrors, requestConfirmExitSchema, RequestConfirmResult, RequestConfirmSuccess, CategoryAlreadyStartedError, categoryAlreadyStartedErrorSchema, CategoryNotPublicError, categoryNotPublicErrorSchema (+16 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (34): CredentialResponse, GsiButtonConfiguration, IdConfiguration, LoginGoogle(), PromptMomentNotification, RevocationResponse, Window, RegisterScreen() (+26 more)

### Community 11 - "Community 11"
Cohesion: 0.05
Nodes (37): dependencies, axios, @azure/monitor-opentelemetry, class-variance-authority, clsx, date-fns, effect, eslint-plugin-perfectionist (+29 more)

### Community 12 - "Community 12"
Cohesion: 0.09
Nodes (31): CountdownTimer(), CountdownTimerProps, difficultyConfig, DifficultyTag(), DifficultyTagProps, CategoryItemCardProps, CertificateCard(), CertificateCardProps (+23 more)

### Community 13 - "Community 13"
Cohesion: 0.06
Nodes (33): AppLanguage, BirthDateCalendar(), BirthDateCalendarProps, backgroundOptions, codingExperienceOptions, durationOptions, genderOptions, goalsOptions (+25 more)

### Community 14 - "Community 14"
Cohesion: 0.19
Nodes (17): CategorySelectionShell(), ComingSoonScreen(), LoadingScreen(), ConfirmationShell(), ConfirmationShellProps, hasReachedConfirmationDeadline(), isUserConfirmed(), authenticatedQuery (+9 more)

### Community 15 - "Community 15"
Cohesion: 0.09
Nodes (20): ChoiceQuestion, choiceQuestionSchema, SequenceOrder, sequenceOrderSchema, Skill, skillSchema, GetExploreSequenceOrderArgs, getExploreSequenceOrderArgsSchema (+12 more)

### Community 16 - "Community 16"
Cohesion: 0.06
Nodes (30): 🏗️ Architecture, Architecture Principles, Available Scripts, Build for Production, Code Style, 🤝 Contributing, 🚀 Deployment, 🔧 Development Guidelines (+22 more)

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (10): Quiz, quizSchema, GetExploreQuizArgs, getExploreQuizArgsSchema, GetExploreQuizErrors, getExploreQuizErrorsSchema, getExploreQuizExitSchema, GetExploreQuizResult (+2 more)

### Community 18 - "Community 18"
Cohesion: 0.25
Nodes (9): categoryContentFn, getSubQuizContentFn, CategoryContentParams, categoryContentQuery(), useCategoryContent(), SubQuizContentParams, subQuizContentQuery(), useSubQuizContent() (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.10
Nodes (27): getExploreCategoryItemFactory(), listExploreCategoryItemsFactory(), startedQuizSchema, GetStartedQuizArgs, getStartedQuizArgsSchema, GetStartedQuizErrors, getStartedQuizErrorsSchema, getStartedQuizExitSchema (+19 more)

### Community 20 - "Community 20"
Cohesion: 0.05
Nodes (38): 1. Environment (server-only — never `VITE_` prefix), 2. Verify locally, 3. Generate traffic, 4. Release gates, Architecture layers, Auth, Automatic (already wired), Azure Monitor — where to look (+30 more)

### Community 21 - "Community 21"
Cohesion: 0.10
Nodes (20): MaxFreeItemsReachedError, maxFreeItemsReachedErrorSchema, PreviousItemNotCompletedError, previousItemNotCompletedErrorSchema, QuizAlreadyStartedError, quizAlreadyStartedErrorSchema, SkillAlreadyStartedError, skillAlreadyStartedErrorSchema (+12 more)

### Community 22 - "Community 22"
Cohesion: 0.33
Nodes (9): useContentNavigation(), UseContentNavigationProps, INavigationCompletionService, NavigationCompletionService, IQuizCompletionService, ISkillCompletionService, useStartQuiz(), useStartSkill() (+1 more)

### Community 23 - "Community 23"
Cohesion: 0.05
Nodes (42): loginErrorsSchema, loginFactory(), loginSuccessSchema, confirmResetPasswordErrorsSchema, confirmResetPasswordFactory(), confirmResetPasswordSuccessSchema, requestResetPasswordErrorsSchema, requestResetPasswordFactory() (+34 more)

### Community 24 - "Community 24"
Cohesion: 0.15
Nodes (12): CategoryAlreadyStartedWithSubscriptionError, categoryAlreadyStartedWithSubscriptionErrorSchema, InvalidExpiredVoucherError, invalidExpiredVoucherErrorSchema, VoucherNotFoundError, voucherNotFoundErrorSchema, SubmitVoucherArgs, submitVoucherArgsSchema (+4 more)

### Community 25 - "Community 25"
Cohesion: 0.16
Nodes (17): CategoryItemProps, FreeTrialDialog(), QuizItemCircle(), QuizItemCircleProps, SkillItemCircle(), SkillItemCircleProps, CompletedSkill, completedSkillSchema (+9 more)

### Community 26 - "Community 26"
Cohesion: 0.12
Nodes (12): BulletContent, BulletElement(), BulletElementProps, BulletGroupProps, CTAElementProps, ImageElementProps, renderSkillElements(), SkillContentDisplay() (+4 more)

### Community 27 - "Community 27"
Cohesion: 0.17
Nodes (11): CategoryContentItem, NavigationManager, IQuizNavigationManager, QuizNavigationManager, ISkillNavigationManager, SkillNavigationManager, INavigationManager, NavigationContext (+3 more)

### Community 28 - "Community 28"
Cohesion: 0.10
Nodes (18): PhoneNumberAlreadyUsedError, phoneNumberAlreadyUsedErrorSchema, TakenUsernameError, takenUsernameErrorSchema, UserAlreadyExistError, userAlreadyExistErrorSchema, RegisterErrors, registerFn (+10 more)

### Community 29 - "Community 29"
Cohesion: 0.20
Nodes (8): FetchContentErrors, fetchContentErrorsSchema, fetchContentFn, FetchContentSuccess, FetchContentWire, fetchErrorSchema, networkErrorSchema, validationErrorSchema

### Community 30 - "Community 30"
Cohesion: 0.20
Nodes (9): GetCertificateArgs, getCertificateArgsSchema, GetCertificateErrors, getCertificateErrorsSchema, GetCertificateExit, getCertificateExitSchema, GetCertificateResult, GetCertificateSuccess (+1 more)

### Community 31 - "Community 31"
Cohesion: 0.06
Nodes (35): Architecture, Auto-instrumentation disabled for incoming HTTP, Automatic log events, Azure Monitor OpenTelemetry (server-only), Build and runtime, Changed files, Client session modules (`src/modules/shared/telemetry/`), Configuration and docs (+27 more)

### Community 32 - "Community 32"
Cohesion: 0.18
Nodes (12): CodeInputGroup(), CodeInputGroupProps, DigitInput, DigitInputProps, ConfirmAccountForm(), ConfirmAccountFormProps, formatCountdown(), getConfirmationCodeExpirationKey() (+4 more)

### Community 33 - "Community 33"
Cohesion: 0.20
Nodes (9): GetCompletedSequenceOrderArgs, getCompletedSequenceOrderArgsSchema, GetCompletedSequenceOrderErrors, getCompletedSequenceOrderErrorsSchema, GetCompletedSequenceOrderExit, getCompletedSequenceOrderExitSchema, GetCompletedSequenceOrderResult, GetCompletedSequenceOrderSuccess (+1 more)

### Community 34 - "Community 34"
Cohesion: 0.28
Nodes (6): ChoiceAnswerFeedbackVariant, getChoiceAnswerFeedbackVariant(), ChoiceQuestionComponentProps, SubQuizRef, ChoiceReviewState, getChoiceReviewState()

### Community 35 - "Community 35"
Cohesion: 0.13
Nodes (12): ResetPasswordCodeStep(), ResetPasswordFieldName, ResetPasswordForm(), ResetPasswordPasswordFieldProps, ResetPasswordPasswordStep(), ResetPasswordPasswordStepProps, ResetPasswordStep, ResetPasswordStepperContext (+4 more)

### Community 36 - "Community 36"
Cohesion: 0.18
Nodes (10): SkillAlreadyCompletedError, skillAlreadyCompletedErrorSchema, SkillNotFoundError, skillNotFoundErrorSchema, CompleteSkillArgs, completeSkillArgsSchema, CompleteSkillErrors, completeSkillExitSchema (+2 more)

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (7): EmailNotFoundError, emailNotFoundErrorSchema, RequestResetPasswordArgs, requestResetPasswordArgsSchema, RequestResetPasswordErrors, RequestResetPasswordResult, RequestResetPasswordSuccess

### Community 38 - "Community 38"
Cohesion: 0.10
Nodes (19): 1. Overview, 2. Tech Stack & Architecture, 3. Sprint Planning (mapped to use cases), 4. Detailed Implementation Planning, 5. Cross-cutting Concerns, **Architecture Layers**, **Planning Document – Loops PWA**, **Sprint 1 – Authentication & Account** (+11 more)

### Community 39 - "Community 39"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 40 - "Community 40"
Cohesion: 0.35
Nodes (8): createBrowserSessionId(), getBrowserSessionAttributes(), normalizeBrowserSessionId(), resolveBrowserSessionId(), resolveBrowserSessionIdFromHeader(), runTelemetryExit(), serverFunctionSpanName(), telemetryFunctionMiddleware

### Community 41 - "Community 41"
Cohesion: 0.17
Nodes (19): AxiosLikeConfig, installAxiosHooks(), resolveAxiosRequest(), TELEMETRY_AXIOS_SPAN, isServerErrorStatus(), statusClass(), toError(), isSensitiveKey() (+11 more)

### Community 42 - "Community 42"
Cohesion: 0.29
Nodes (8): cryptoRandomUuidSchema, hasCryptoRandomUuid(), isRequestUrl, isString, isUrl, requestUrlSchema, resolveFetchInputUrl(), windowGlobalSchema

### Community 43 - "Community 43"
Cohesion: 0.13
Nodes (13): CategoryActionButton(), CategoryActionButtonProps, CategoryDetailsProps, ProfileProgressSectionProps, ProfileScreen(), NumberField, User, useUpdateCurrentCategory() (+5 more)

### Community 44 - "Community 44"
Cohesion: 0.09
Nodes (22): GetExploreCategoryItemArgs, getExploreCategoryItemArgsSchema, GetExploreCategoryItemErrors, getExploreCategoryItemErrorsSchema, GetExploreCategoryItemExit, getExploreCategoryItemExitSchema, GetExploreCategoryItemResult, GetExploreCategoryItemSuccess (+14 more)

### Community 45 - "Community 45"
Cohesion: 0.14
Nodes (20): resources, resolveHeadBrowserSessionId(), deletePendingLanguageFn, setUserTimezoneFn, RouterContext, DefaultErrorComponent(), DefaultNotFoundComponent(), LazyGlobalErrorComponent (+12 more)

### Community 46 - "Community 46"
Cohesion: 0.12
Nodes (15): Accessibility, Animations and Transitions, CSS Best Practices, Forms, HTML Best Practices, Key Principles, Layout, Media (+7 more)

### Community 47 - "Community 47"
Cohesion: 0.20
Nodes (19): instrumentRefreshRequest(), buildCorrelationAttributes(), logServerError(), logServerInfo(), recordAuthRedirect(), recordMetric(), ServerMetricInput, withServerSpan() (+11 more)

### Community 48 - "Community 48"
Cohesion: 0.09
Nodes (24): CategoryContentNavigationHeader(), CategoryContentNavigationHeaderProps, QuizContentScreenProps, QuizStep, QuizStepper(), QuizStepperContext, QuizStepperContextType, QuizStepperProps (+16 more)

### Community 49 - "Community 49"
Cohesion: 0.28
Nodes (7): requestConfirmErrorsSchema, requestConfirmFactory(), requestConfirmSuccessSchema, RequestConfirmErrors, requestConfirmFn, RequestConfirmSuccess, RequestConfirmWire

### Community 50 - "Community 50"
Cohesion: 0.14
Nodes (13): compilerOptions, baseUrl, exactOptionalPropertyTypes, jsx, module, moduleResolution, paths, resolveJsonModule (+5 more)

### Community 51 - "Community 51"
Cohesion: 0.19
Nodes (13): createDisabledTelemetryConfig(), parseTelemetryConfig(), TelemetryConfig, runSyncExitOrElse(), envPath, createNoopTelemetryRegistry(), normalizeRegistry(), setTelemetry() (+5 more)

### Community 52 - "Community 52"
Cohesion: 0.12
Nodes (19): ContentScreenSkeleton(), QuizContentScreen(), SelectedContentScreen(), SelectedContentScreenProps, SelectedContentWrapper(), SelectedContentWrapperProps, SkillContentScreen(), initialNavigationState (+11 more)

### Community 53 - "Community 53"
Cohesion: 0.09
Nodes (24): abortSignalSchema, applicationInsightsConnectionStringSchema, AxiosConfigTelemetry, axiosConfigTelemetrySchema, AxiosErrorTelemetry, axiosErrorTelemetrySchema, collectTelemetryPrimitives(), decodeAbortSignal() (+16 more)

### Community 54 - "Community 54"
Cohesion: 0.09
Nodes (21): logoutErrorsSchema, logoutSuccessSchema, DeleteAccountConfirmDialog(), DeleteAccountConfirmDialogProps, DeleteAccountConfirmFormValues, LogoutConfirmDialog(), LogoutConfirmDialogProps, SettingsRowProps (+13 more)

### Community 55 - "Community 55"
Cohesion: 0.17
Nodes (11): bulletSchema, contentBodySchema, contentImageSchema, contentVideoSchema, ctaSchema, elementSchema, formattedTextSchema, imageUrlsSchema (+3 more)

### Community 56 - "Community 56"
Cohesion: 0.18
Nodes (10): InvalidFileError, invalidFileErrorSchema, UploadFileArgs, uploadFileArgsSchema, UploadFileErrors, uploadFileErrorsSchema, uploadFileExitSchema, UploadFileResult (+2 more)

### Community 57 - "Community 57"
Cohesion: 0.11
Nodes (18): Auth redirect telemetry, Changelog, Counter, File reference, How to use in Azure Monitor (today), Log, Phase 1 — Instrumentation completeness, Phase 2 — Proactive refresh on 401 (+10 more)

### Community 58 - "Community 58"
Cohesion: 0.17
Nodes (11): Current Sprint – Authentication & Account Management, Future Sprints – Planned Features, Loops PWA - Sprint Planning & Task Management, Recently Completed Work, Sprint 2 – Category & Content Exploration, Sprint 3 – Voucher Submission, Sprint 4 – Content Progress Flow, Sprint 5 – Quiz Room Participation (+3 more)

### Community 59 - "Community 59"
Cohesion: 0.24
Nodes (9): validateChoiceQuestionArgsSchema, validateChoiceQuestionErrorsSchema, validateChoiceQuestionSuccessSchema, useValidateChoiceQuestion(), ValidateChoiceQuestionArgs, ValidateChoiceQuestionErrors, validateChoiceQuestionFn, ValidateChoiceQuestionSuccess (+1 more)

### Community 60 - "Community 60"
Cohesion: 0.07
Nodes (35): OptionCard(), OptionCardProps, variantStyles, ProgressBar(), AwardIcon(), ClockIcon(), CodeClipboardIcon(), CodeMessageIcon() (+27 more)

### Community 61 - "Community 61"
Cohesion: 0.18
Nodes (10): pre-commit, husky, hooks, license, lint-staged, *.{js,jsx,ts,tsx,json,css,scss,md}, main, name (+2 more)

### Community 62 - "Community 62"
Cohesion: 0.18
Nodes (10): 1. DECONSTRUCT, 2. DIAGNOSE, 3. DEVELOP, 4. DELIVER, OPERATING MODES, OPTIMIZATION TECHNIQUES, PROCESSING FLOW, RESPONSE FORMATS (+2 more)

### Community 63 - "Community 63"
Cohesion: 0.11
Nodes (17): Architecture decisions, Current state (inspected), Environment variables, Files to change, Incoming HTTP, Instrumentation map, Lifecycle, Logs (+9 more)

### Community 64 - "Community 64"
Cohesion: 0.25
Nodes (7): startChoiceQuestionErrorsSchema, startChoiceQuestionFactory(), startChoiceQuestionSuccessSchema, StartChoiceQuestionErrors, startChoiceQuestionFn, StartChoiceQuestionSuccess, StartChoiceQuestionWire

### Community 65 - "Community 65"
Cohesion: 0.08
Nodes (25): RefreshArgs, refreshArgsSchema, RefreshErrors, refreshErrorsSchema, RefreshResult, RefreshSuccess, GetCompletedChoiceQuestionArgs, getCompletedChoiceQuestionArgsSchema (+17 more)

### Community 66 - "Community 66"
Cohesion: 0.22
Nodes (9): SubQuiz, subQuizSchema, getExploreSubQuizErrorsSchema, getExploreSubQuizFactory(), fetchSubQuizContentEffect(), GetSubQuizContentErrors, GetSubQuizContentParams, GetSubQuizContentSuccess (+1 more)

### Community 68 - "Community 68"
Cohesion: 0.08
Nodes (30): RegisterForm(), RegisterFormProps, RegisterCredentials, RegisterSuccessScreen(), RegisterSuccessViewProps, ResetPasswordCodeStepProps, ResetPasswordEmailStep(), ResetPasswordEmailStepProps (+22 more)

### Community 69 - "Community 69"
Cohesion: 0.20
Nodes (9): 1. Language and Style, 2. UI Components & Forms, 3. Internationalization (i18n), 4. Error Handling, 5. Performance & Data Caching, 6. PWA Best Practices, 7. Layer Interaction & Modularity, 8. Testing & Maintainability (+1 more)

### Community 70 - "Community 70"
Cohesion: 0.12
Nodes (18): CategorySelectionScreen(), CategorySelectionShellProps, CategoriesListSkeleton(), CategoryContentSkeleton(), CategoryDetailsSkeleton(), BackButton(), BackButtonProps, CategoriesList() (+10 more)

### Community 71 - "Community 71"
Cohesion: 0.50
Nodes (4): BidirectionalText(), BidirectionalTextProps, splitBidirectionalText(), TextSegment

### Community 72 - "Community 72"
Cohesion: 0.70
Nodes (3): SkillContentRenderer(), skillContentQuery(), useSkillContent()

### Community 73 - "Community 73"
Cohesion: 0.14
Nodes (14): scripts, build, build:instrument, build:raw, dev, lint:fix, lint:format, pm2:reload (+6 more)

### Community 75 - "Community 75"
Cohesion: 0.22
Nodes (8): Character Encoding, CSS and Layout, Form Internationalization, Images and Media, Language Declaration, Numbers, Dates, and Currencies, Semantic Structure, Text Direction

### Community 76 - "Community 76"
Cohesion: 0.33
Nodes (5): ensure_swarm_manager(), login_to_ghcr_if_needed(), main(), write_env_file(), deploy-staging.sh script

### Community 77 - "Community 77"
Cohesion: 0.13
Nodes (15): QuizActionButton(), StartedQuiz, HalfStarIcon(), NoteIcon(), TimerIcon(), QuizHeader(), QuizHeaderProps, getQuizTimerPresentationState() (+7 more)

### Community 78 - "Community 78"
Cohesion: 0.22
Nodes (8): LoginArgs, loginArgsSchema, LoginErrors, loginExitSchema, LoginResult, LoginSuccess, UserPasswordNotSetOrInvalidProviderError, userPasswordNotSetOrInvalidProviderErrorSchema

### Community 80 - "Community 80"
Cohesion: 0.28
Nodes (7): CompleteSkillErrors, completeSkillFn, CompleteSkillSuccess, CompleteSkillWire, completeSkillErrorsSchema, completeSkillFactory(), completeSkillSuccessSchema

### Community 81 - "Community 81"
Cohesion: 0.06
Nodes (34): confirmAccountErrorsSchema, confirmAccountSuccessSchema, VoucherStepperVoucherStep(), validateSequenceOrderArgsSchema, validateSequenceOrderErrorsSchema, validateSequenceOrderSuccessSchema, ConfirmAccountErrors, confirmAccountFn (+26 more)

### Community 82 - "Community 82"
Cohesion: 0.10
Nodes (25): GlobalErrorComponent(), GlobalErrorComponentProps, HomeSkeleton(), NotFoundComponent(), SpaceBackground(), FreeTrialDialogProps, QuizActionButtonProps, SkillActionButton() (+17 more)

### Community 84 - "Community 84"
Cohesion: 0.12
Nodes (19): GoogleLoginArgs, googleLoginArgsSchema, GoogleLoginErrors, googleLoginErrorsSchema, googleLoginExitSchema, GoogleLoginResult, GoogleLoginSuccess, googleLoginSuccessSchema (+11 more)

### Community 85 - "Community 85"
Cohesion: 0.20
Nodes (9): Current Repository Status, Optional Telemetry Environment Variables (server-only), Performance Monitoring Checklist, Production Readiness Checklist, Recommended Production Defaults, Release Gates, Required Environment Variables, Security Considerations (+1 more)

### Community 87 - "Community 87"
Cohesion: 0.18
Nodes (10): VoucherRequest, voucherRequestSchema, voucherRequestStatusSchema, VoucherRequestNotFoundError, voucherRequestNotFoundErrorSchema, GetVoucherRequestArgs, getVoucherRequestArgsSchema, GetVoucherRequestErrors (+2 more)

### Community 88 - "Community 88"
Cohesion: 0.19
Nodes (28): confirmAccountFactory(), googleLoginFactory(), logoutFactory(), refreshAccessToken(), getCompletedChoiceQuestionFactory(), getExploreChoiceQuestionFactory(), validateChoiceQuestionFactory(), uploadFileFactory() (+20 more)

### Community 89 - "Community 89"
Cohesion: 0.29
Nodes (6): Best Practices for Workflow, Code Quality Standards, Code Structure & Modularity, Documentation & Explainability, Planning & Task Management, Test-Driven Development Workflow

### Community 90 - "Community 90"
Cohesion: 0.67
Nodes (6): build_app(), copy_instrumentation(), copy_pwa_runtime_files(), log(), remove_temporary_artifacts(), app.sh script

### Community 91 - "Community 91"
Cohesion: 0.08
Nodes (25): IsAuthenticatedErrors, IsAuthenticatedSuccess, IsAuthenticatedWire, DeleteAccountArgs, deleteAccountErrorsSchema, deleteAccountFactory(), deleteAccountSuccessSchema, DeleteAccountErrors (+17 more)

### Community 103 - "Community 103"
Cohesion: 0.16
Nodes (15): fetch(), fetch(), getLivenessResponse(), getReadinessResponse(), HealthResponse, processSnapshot(), ReadyResponse, EXCLUDED_EXACT (+7 more)

### Community 112 - "Community 112"
Cohesion: 0.25
Nodes (7): SubmitVoucherErrors, submitVoucherFn, SubmitVoucherSuccess, SubmitVoucherWire, submitVoucherErrorsSchema, submitVoucherFactory(), submitVoucherSuccessSchema

### Community 116 - "Community 116"
Cohesion: 0.32
Nodes (6): startQuizErrorsSchema, startQuizSuccessSchema, StartQuizErrors, startQuizFn, StartQuizSuccess, StartQuizWire

### Community 117 - "Community 117"
Cohesion: 0.32
Nodes (6): StartSkillErrors, startSkillFn, StartSkillSuccess, StartSkillWire, startSkillErrorsSchema, startSkillSuccessSchema

### Community 119 - "Community 119"
Cohesion: 0.25
Nodes (7): startSequenceOrderErrorsSchema, startSequenceOrderFactory(), startSequenceOrderSuccessSchema, StartSequenceOrderErrors, startSequenceOrderFn, StartSequenceOrderSuccess, StartSequenceOrderWire

## Knowledge Gaps
- **985 isolated node(s):** `husky.sh script`, `$schema`, `style`, `rsc`, `tsx` (+980 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CategoryContentItem` connect `Community 27` to `Community 0`, `Community 3`, `Community 67`, `Community 104`, `Community 12`, `Community 77`, `Community 48`, `Community 82`, `Community 19`, `Community 52`, `Community 22`, `Community 25`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 12` to `Community 32`, `Community 0`, `Community 34`, `Community 35`, `Community 68`, `Community 4`, `Community 70`, `Community 10`, `Community 77`, `Community 82`, `Community 54`, `Community 25`, `Community 26`, `Community 60`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `User` connect `Community 43` to `Community 3`, `Community 68`, `Community 70`, `Community 13`, `Community 14`, `Community 54`, `Community 91`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `style` to the rest of the system?**
  _985 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.066167290886392 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.054987212276214836 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06923076923076923 - nodes in this community are weakly interconnected._