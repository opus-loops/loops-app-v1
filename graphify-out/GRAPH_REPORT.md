# Graph Report - loops-app-v1  (2026-07-10)

## Corpus Check
- 466 files · ~1,824,023 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2317 nodes · 5475 edges · 114 communities (106 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `52bf985e`
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
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 100|Community 100]]
- [[_COMMUNITY_Community 103|Community 103]]
- [[_COMMUNITY_Community 104|Community 104]]
- [[_COMMUNITY_Community 106|Community 106]]
- [[_COMMUNITY_Community 111|Community 111]]
- [[_COMMUNITY_Community 112|Community 112]]
- [[_COMMUNITY_Community 113|Community 113]]

## God Nodes (most connected - your core abstractions)
1. `instanceFactory()` - 92 edges
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
- `fetch()` --calls--> `handleInstrumentedRequest()`  [EXTRACTED]
  src/entry-server.tsx → src/server/telemetry/request.ts
- `ConfirmAccountForm()` --calls--> `useToast()`  [EXTRACTED]
  src/modules/account-management/features/account-confirmation/services/confirm-account-form.tsx → src/modules/shared/hooks/use-toast.ts

## Import Cycles
- 1-file cycle: `src/server/telemetry/effect.ts -> src/server/telemetry/effect.ts`
- 1-file cycle: `src/server/telemetry/browser-session.ts -> src/server/telemetry/browser-session.ts`
- 3-file cycle: `src/routeTree.gen.ts -> src/routes/__root.tsx -> src/router.tsx -> src/routeTree.gen.ts`

## Communities (114 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.20
Nodes (7): ChoiceQuestionNavigationManager, SequenceOrderNavigationManager, SubQuizNavigatorManager, ISubQuizNavigationManager, SubQuizNavigationContext, SubQuizNavigationError, EnhancedSubQuiz

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (44): StartChoiceQuestionArgs, startChoiceQuestionArgsSchema, StartChoiceQuestionErrors, StartChoiceQuestionExit, startChoiceQuestionExitSchema, StartChoiceQuestionResult, StartChoiceQuestionSuccess, ValidateChoiceQuestionArgs (+36 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (39): ConfirmAccountArgs, confirmAccountArgsSchema, ConfirmAccountErrors, confirmAccountExitSchema, ConfirmAccountResult, ConfirmAccountSuccess, RefreshArgs, refreshArgsSchema (+31 more)

### Community 3 - "Community 3"
Cohesion: 0.33
Nodes (5): updateCurrentCategoryErrorsSchema, UpdateCurrentCategoryErrors, updateCurrentCategoryFn, UpdateCurrentCategorySuccess, UpdateCurrentCategoryWire

### Community 4 - "Community 4"
Cohesion: 0.23
Nodes (10): FreeTrialDialogStep, VoucherStepperDialog(), VoucherStepperDialogProps, VoucherStepperSelectionStep(), VoucherStepperSelectionStepProps, useStartCategory(), KeyIcon(), RocketIcon() (+2 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (33): ListExploreCategoriesErrors, listExploreCategoriesErrorsSchema, listExploreCategoriesExitSchema, listExploreCategoriesFactory(), ListExploreCategoriesQuery, listExploreCategoriesQuerySchema, ListExploreCategoriesResult, ListExploreCategoriesSuccess (+25 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (38): devDependencies, esbuild, eslint, eslint-config-prettier, @eslint/css, @eslint/js, @eslint/json, @eslint/markdown (+30 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (30): Route, Route, Route, Route, Route, Route, Route, Route (+22 more)

### Community 8 - "Community 8"
Cohesion: 0.05
Nodes (43): LoginArgs, loginArgsSchema, LoginErrors, loginExitSchema, LoginResult, LoginSuccess, GetExploreCategoryArgs, getExploreCategoryArgsSchema (+35 more)

### Community 9 - "Community 9"
Cohesion: 0.07
Nodes (32): CategoryAlreadyStartedError, categoryAlreadyStartedErrorSchema, CategoryAlreadyStartedWithSubscriptionError, categoryAlreadyStartedWithSubscriptionErrorSchema, CategoryNotFoundError, categoryNotFoundErrorSchema, CategoryNotPublicError, categoryNotPublicErrorSchema (+24 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (26): CredentialResponse, GsiButtonConfiguration, IdConfiguration, LoginGoogle(), PromptMomentNotification, RevocationResponse, Window, RegisterCredentials (+18 more)

### Community 11 - "Community 11"
Cohesion: 0.05
Nodes (37): dependencies, axios, @azure/monitor-opentelemetry, class-variance-authority, clsx, date-fns, effect, eslint-plugin-perfectionist (+29 more)

### Community 12 - "Community 12"
Cohesion: 0.09
Nodes (26): CountdownTimer(), CountdownTimerProps, CertificateCardProps, DeleteAccountConfirmDialog(), DeleteAccountConfirmDialogProps, DeleteAccountConfirmFormValues, QuizActionButton(), NoteIcon() (+18 more)

### Community 13 - "Community 13"
Cohesion: 0.05
Nodes (36): useUpdatePreferences(), AppLanguage, BirthDateCalendar(), BirthDateCalendarProps, backgroundOptions, codingExperienceOptions, durationOptions, genderOptions (+28 more)

### Community 14 - "Community 14"
Cohesion: 0.22
Nodes (15): CategorySelectionShell(), ComingSoonScreen(), ConfirmationShell(), authenticatedQuery, useAuth(), CategoryIcon(), FlashIcon(), StarIcon() (+7 more)

### Community 15 - "Community 15"
Cohesion: 0.10
Nodes (18): ChoiceQuestion, choiceQuestionSchema, CompletedChoiceQuestion, completedChoiceQuestionSchema, CompletedSequenceOrder, completedSequenceOrderSchema, Quiz, quizSchema (+10 more)

### Community 16 - "Community 16"
Cohesion: 0.06
Nodes (30): 🏗️ Architecture, Architecture Principles, Available Scripts, Build for Production, Code Style, 🤝 Contributing, 🚀 Deployment, 🔧 Development Guidelines (+22 more)

### Community 17 - "Community 17"
Cohesion: 0.27
Nodes (8): ConfirmAccountDialog(), ConfirmAccountDialogProps, FreeTrialDialogProps, DialogContent, DialogDescription, DialogFooter(), DialogOverlay, DialogTitle

### Community 18 - "Community 18"
Cohesion: 0.04
Nodes (45): 1. Environment, 2. Confirm telemetry is up, 3. Generate traffic, 4. Correlation from the browser, All API calls with caller + session context, API call tracing and caller context, API error rate by resource and caller, Application Insights portal (UI) (+37 more)

### Community 19 - "Community 19"
Cohesion: 0.11
Nodes (52): confirmAccountFactory(), requestConfirmFactory(), googleLoginFactory(), loginFactory(), logoutFactory(), refreshAccessToken(), getExploreCategoryFactory(), getExploreCategoryItemFactory() (+44 more)

### Community 20 - "Community 20"
Cohesion: 0.05
Nodes (41): 1. Environment (server-only — never `VITE_` prefix), 2. Verify locally, 3. Generate traffic, 4. Release gates, Architecture layers, Auth, Automatic (already wired), Azure Monitor — where to look (+33 more)

### Community 21 - "Community 21"
Cohesion: 0.07
Nodes (32): MaxFreeItemsReachedError, maxFreeItemsReachedErrorSchema, NotCategoryItemError, notCategoryItemErrorSchema, PreviousItemNotCompletedError, previousItemNotCompletedErrorSchema, QuizAlreadyStartedError, quizAlreadyStartedErrorSchema (+24 more)

### Community 22 - "Community 22"
Cohesion: 0.26
Nodes (6): INavigationCompletionService, NavigationCompletionService, IQuizCompletionService, QuizCompletionService, ISkillCompletionService, NavigationStartWire

### Community 23 - "Community 23"
Cohesion: 0.04
Nodes (68): confirmAccountErrorsSchema, confirmAccountSuccessSchema, requestConfirmErrorsSchema, requestConfirmSuccessSchema, startChoiceQuestionErrorsSchema, startChoiceQuestionSuccessSchema, onboardingErrorsSchema, onboardingSuccessSchema (+60 more)

### Community 24 - "Community 24"
Cohesion: 0.09
Nodes (21): GetExploreCategoryItemArgs, getExploreCategoryItemArgsSchema, GetExploreCategoryItemErrors, getExploreCategoryItemErrorsSchema, GetExploreCategoryItemExit, getExploreCategoryItemExitSchema, GetExploreCategoryItemResult, GetExploreCategoryItemSuccess (+13 more)

### Community 25 - "Community 25"
Cohesion: 0.20
Nodes (15): CategoryItemProps, FreeTrialDialog(), QuizItemCircle(), QuizItemCircleProps, SkillItemCircle(), SkillItemCircleProps, useSelectedContent(), BookIcon() (+7 more)

### Community 26 - "Community 26"
Cohesion: 0.07
Nodes (23): SkillContentRenderer(), FetchContentErrors, fetchContentErrorsSchema, fetchContentFn, FetchContentSuccess, FetchContentWire, fetchErrorSchema, networkErrorSchema (+15 more)

### Community 27 - "Community 27"
Cohesion: 0.20
Nodes (11): CategoryContentItem, NavigationManager, IQuizNavigationManager, QuizNavigationManager, ISkillNavigationManager, SkillNavigationManager, INavigationManager, NavigationContext (+3 more)

### Community 28 - "Community 28"
Cohesion: 0.15
Nodes (12): PhoneNumberAlreadyUsedError, phoneNumberAlreadyUsedErrorSchema, TakenUsernameError, takenUsernameErrorSchema, UserAlreadyExistError, userAlreadyExistErrorSchema, RegisterArgs, registerArgsSchema (+4 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (13): CategorySelectionScreen(), exploreCategoriesFn, getQuizContentFn, getSubQuizContentFn, exploreCategoriesQuery(), useExploreCategories(), QuizContentParams, quizContentQuery() (+5 more)

### Community 30 - "Community 30"
Cohesion: 0.20
Nodes (9): GetCompletedSequenceOrderArgs, getCompletedSequenceOrderArgsSchema, GetCompletedSequenceOrderErrors, getCompletedSequenceOrderErrorsSchema, GetCompletedSequenceOrderExit, getCompletedSequenceOrderExitSchema, GetCompletedSequenceOrderResult, GetCompletedSequenceOrderSuccess (+1 more)

### Community 31 - "Community 31"
Cohesion: 0.06
Nodes (35): Architecture, Auto-instrumentation disabled for incoming HTTP, Automatic log events, Azure Monitor OpenTelemetry (server-only), Build and runtime, Call context modules (`src/modules/shared/telemetry/` + query client), Changed files, Configuration and docs (+27 more)

### Community 32 - "Community 32"
Cohesion: 0.20
Nodes (13): confirmAccountFn, ConfirmAccountWire, ConfirmAccountForm(), ConfirmAccountFormProps, formatCountdown(), getConfirmationCodeExpirationKey(), getRemainingMinutes(), readStoredTimeLeft() (+5 more)

### Community 33 - "Community 33"
Cohesion: 0.08
Nodes (25): RequestConfirmErrors, requestConfirmExitSchema, RequestConfirmResult, RequestConfirmSuccess, GetCertificateArgs, getCertificateArgsSchema, GetCertificateErrors, getCertificateErrorsSchema (+17 more)

### Community 34 - "Community 34"
Cohesion: 0.11
Nodes (18): BidirectionalText(), BidirectionalTextProps, splitBidirectionalText(), TextSegment, ChoiceAnswerFeedbackVariant, getChoiceAnswerFeedbackVariant(), ChoiceQuestionComponentProps, SubQuizRef (+10 more)

### Community 35 - "Community 35"
Cohesion: 0.10
Nodes (19): CodeInputGroup(), CodeInputGroupProps, DigitInput, DigitInputProps, ResetPasswordCodeStep(), ResetPasswordCodeStepProps, ResetPasswordEmailStep(), ResetPasswordFieldName (+11 more)

### Community 36 - "Community 36"
Cohesion: 0.24
Nodes (8): SubQuiz, getExploreSubQuizErrorsSchema, getExploreSubQuizFactory(), fetchSubQuizContentEffect(), GetSubQuizContentErrors, GetSubQuizContentParams, GetSubQuizContentSuccess, GetSubQuizContentWire

### Community 37 - "Community 37"
Cohesion: 0.13
Nodes (13): LogoutArgs, logoutArgsSchema, LogoutErrors, LogoutResult, LogoutSuccess, EmailNotFoundError, emailNotFoundErrorSchema, RequestResetPasswordArgs (+5 more)

### Community 38 - "Community 38"
Cohesion: 0.10
Nodes (19): 1. Overview, 2. Tech Stack & Architecture, 3. Sprint Planning (mapped to use cases), 4. Detailed Implementation Planning, 5. Cross-cutting Concerns, **Architecture Layers**, **Planning Document – Loops PWA**, **Sprint 1 – Authentication & Account** (+11 more)

### Community 39 - "Community 39"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 40 - "Community 40"
Cohesion: 0.30
Nodes (9): startInstance, createBrowserSessionId(), getBrowserSessionAttributes(), normalizeBrowserSessionId(), resolveBrowserSessionId(), resolveBrowserSessionIdFromHeader(), runTelemetryExit(), telemetryFunctionMiddleware (+1 more)

### Community 41 - "Community 41"
Cohesion: 0.13
Nodes (25): callContextStorage, getCallContext(), getCallContextStack(), runWithCallContext(), runWithCallContextStack(), createDisabledTelemetryConfig(), parseTelemetryConfig(), TelemetryConfig (+17 more)

### Community 42 - "Community 42"
Cohesion: 0.13
Nodes (19): GlobalErrorComponent(), GlobalErrorComponentProps, HomeSkeleton(), NotFoundComponent(), SpaceBackground(), QuizActionButtonProps, FirstInstallShell(), FirstInstallShellProps (+11 more)

### Community 43 - "Community 43"
Cohesion: 0.08
Nodes (32): CategorySelectionShellProps, CategoriesListSkeleton(), CategoryContentSkeleton(), CategoryDetailsSkeleton(), BackButton(), BackButtonProps, CategoryActionButton(), CategoryActionButtonProps (+24 more)

### Community 44 - "Community 44"
Cohesion: 0.21
Nodes (8): CategoryItemCircle(), CategoryMapping(), CategoryItemProps, CategoryMappingProps, CompletedSkill, completedSkillSchema, StartedQuiz, startedQuizSchema

### Community 45 - "Community 45"
Cohesion: 0.14
Nodes (21): resources, resolveHeadBrowserSessionId(), deletePendingLanguageFn, getPendingLanguageFn, setUserTimezoneFn, bootstrapBrowserSessionId(), ensureBrowserSessionId(), getBrowserSessionId() (+13 more)

### Community 46 - "Community 46"
Cohesion: 0.12
Nodes (15): Accessibility, Animations and Transitions, CSS Best Practices, Forms, HTML Best Practices, Key Principles, Layout, Media (+7 more)

### Community 47 - "Community 47"
Cohesion: 0.27
Nodes (13): instrumentRefreshRequest(), buildCorrelationAttributes(), logServerError(), logServerInfo(), recordAuthRedirect(), recordMetric(), serverFunctionSpanName(), ServerMetricInput (+5 more)

### Community 48 - "Community 48"
Cohesion: 0.10
Nodes (21): CategoryContentNavigationHeader(), CategoryContentNavigationHeaderProps, QuizContentScreen(), QuizContentScreenProps, SelectedContentScreenProps, SkillContentScreen(), SkillContentScreenProps, SkillStep (+13 more)

### Community 49 - "Community 49"
Cohesion: 0.25
Nodes (7): GetExploreSkillArgs, getExploreSkillArgsSchema, GetExploreSkillErrors, getExploreSkillExitSchema, GetExploreSkillResult, GetExploreSkillSuccess, getExploreSkillSuccessSchema

### Community 50 - "Community 50"
Cohesion: 0.14
Nodes (13): compilerOptions, baseUrl, exactOptionalPropertyTypes, jsx, module, moduleResolution, paths, resolveJsonModule (+5 more)

### Community 51 - "Community 51"
Cohesion: 0.09
Nodes (28): createInstrumentedQueryClient(), formatQueryKey(), instrumentMutationCache(), instrumentQueryCache(), summarizeQueryFilter(), formatCallPath(), getCallStackAttributes(), ApiCallContext (+20 more)

### Community 52 - "Community 52"
Cohesion: 0.16
Nodes (12): SelectedContentScreen(), SelectedContentWrapper(), SelectedContentWrapperProps, initialNavigationState, NavigationState, SelectedContentContext, SelectedContentContextType, SelectedContentProvider() (+4 more)

### Community 53 - "Community 53"
Cohesion: 0.07
Nodes (43): AxiosLikeConfig, installAxiosHooks(), resolveAxiosRequest(), TELEMETRY_AXIOS_SPAN, isServerErrorStatus(), statusClass(), toError(), isSensitiveKey() (+35 more)

### Community 54 - "Community 54"
Cohesion: 0.22
Nodes (9): LogoutConfirmDialog(), LogoutConfirmDialogProps, SettingsRowProps, SettingsScreen(), SettingsScreenProps, shouldShowConfirmAccountAction(), useDeleteAccount(), ExitIcon() (+1 more)

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
Cohesion: 0.27
Nodes (8): validateChoiceQuestionArgsSchema, validateChoiceQuestionErrorsSchema, validateChoiceQuestionSuccessSchema, ValidateChoiceQuestionArgs, ValidateChoiceQuestionErrors, validateChoiceQuestionFn, ValidateChoiceQuestionSuccess, ValidateChoiceQuestionWire

### Community 60 - "Community 60"
Cohesion: 0.07
Nodes (32): OptionCard(), OptionCardProps, variantStyles, ProgressBar(), AwardIcon(), CodeClipboardIcon(), CodeMessageIcon(), GameIcon() (+24 more)

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
Cohesion: 0.10
Nodes (19): Add `TraceRegion` on a route when, Add `useCallPathSegment` on a hook when, Call-path instrumentation guide, Checklist for new features, Deferred (add only when debugging), Example paths after instrumentation, How to add instrumentation, Instrumented hooks (+11 more)

### Community 65 - "Community 65"
Cohesion: 0.20
Nodes (9): GetCompletedChoiceQuestionArgs, getCompletedChoiceQuestionArgsSchema, GetCompletedChoiceQuestionErrors, getCompletedChoiceQuestionErrorsSchema, GetCompletedChoiceQuestionExit, getCompletedChoiceQuestionExitSchema, GetCompletedChoiceQuestionResult, GetCompletedChoiceQuestionSuccess (+1 more)

### Community 66 - "Community 66"
Cohesion: 0.11
Nodes (17): subQuizSchema, ResourceAccessForbiddenError, GetExploreSubQuizArgs, getExploreSubQuizArgsSchema, GetExploreSubQuizErrors, getExploreSubQuizExitSchema, GetExploreSubQuizResult, GetExploreSubQuizSuccess (+9 more)

### Community 67 - "Community 67"
Cohesion: 0.21
Nodes (9): RouterContext, createRouter(), DefaultErrorComponent(), DefaultNotFoundComponent(), LazyGlobalErrorComponent, LazyNotFoundComponent, Register, Register (+1 more)

### Community 68 - "Community 68"
Cohesion: 0.11
Nodes (21): CategoriesList(), CategoriesListProps, CategoryCard(), CategoryCardProps, RegisterForm(), RegisterFormProps, ResetPasswordEmailStepProps, ResetPasswordPasswordFieldProps (+13 more)

### Community 69 - "Community 69"
Cohesion: 0.20
Nodes (9): 1. Language and Style, 2. UI Components & Forms, 3. Internationalization (i18n), 4. Error Handling, 5. Performance & Data Caching, 6. PWA Best Practices, 7. Layer Interaction & Modularity, 8. Testing & Maintainability (+1 more)

### Community 70 - "Community 70"
Cohesion: 0.23
Nodes (8): ContentScreenSkeleton(), LoadingScreen(), ConfirmationShellProps, hasReachedConfirmationDeadline(), isUserConfirmed(), usePageLoading(), SelectedContentShell(), SelectedContentShellProps

### Community 71 - "Community 71"
Cohesion: 0.21
Nodes (6): SubQuizStrategySelector, useStartSequenceOrder(), ISubQuizNavigationStrategy, SubQuizNavigationStrategy, ChoiceQuestionToSequenceOrderStrategy, SequenceOrderToSequenceOrderStrategy

### Community 72 - "Community 72"
Cohesion: 0.16
Nodes (13): difficultyConfig, DifficultyTag(), DifficultyTagProps, CategoryItemCard(), CategoryItemCardProps, ProgressCircle(), QuizCard(), QuizCardProps (+5 more)

### Community 73 - "Community 73"
Cohesion: 0.14
Nodes (14): scripts, build, build:instrument, build:raw, dev, lint:fix, lint:format, pm2:reload (+6 more)

### Community 74 - "Community 74"
Cohesion: 0.21
Nodes (8): deleteAccountFn, onboardingFn, OnboardingWire, GlobalErrorContext, GlobalErrorContextType, GlobalErrorProvider(), GlobalErrorProviderProps, sessionCleanupFn

### Community 75 - "Community 75"
Cohesion: 0.22
Nodes (8): Character Encoding, CSS and Layout, Form Internationalization, Images and Media, Language Declaration, Numbers, Dates, and Currencies, Semantic Structure, Text Direction

### Community 76 - "Community 76"
Cohesion: 0.33
Nodes (5): ensure_swarm_manager(), login_to_ghcr_if_needed(), main(), write_env_file(), deploy-staging.sh script

### Community 77 - "Community 77"
Cohesion: 0.16
Nodes (13): useSelectedSubQuiz(), ChoiceQuestionComponent, SequenceOrderComponent, SubQuizRef, QuizHeader(), QuizHeaderProps, getQuizTimerPresentationState(), QuizTimerPresentationStateArgs (+5 more)

### Community 78 - "Community 78"
Cohesion: 0.17
Nodes (13): getExploreQuizErrorsSchema, getStartedQuizErrorsSchema, CategoryContentErrors, CategoryContentParams, CategoryContentSuccess, CategoryContentWire, SingleCategoryItemErrors, SingleCategoryItemParams (+5 more)

### Community 79 - "Community 79"
Cohesion: 0.21
Nodes (9): CertificateCard(), HomeScreen(), HomeScreenProps, ProfileProgressSectionProps, ProfileScreen(), GearIcon(), HalfStarIcon(), OpenCategoriesButton() (+1 more)

### Community 80 - "Community 80"
Cohesion: 0.16
Nodes (14): SkillActionButton(), SkillActionButtonProps, useCompleteSkill(), useContentNavigation(), UseContentNavigationProps, completeSkillFn, CompleteSkillWire, startQuizFn (+6 more)

### Community 81 - "Community 81"
Cohesion: 0.24
Nodes (9): validateSequenceOrderArgsSchema, validateSequenceOrderErrorsSchema, validateSequenceOrderSuccessSchema, useValidateSequenceOrder(), ValidateSequenceOrderArgs, ValidateSequenceOrderErrors, validateSequenceOrderFn, ValidateSequenceOrderSuccess (+1 more)

### Community 82 - "Community 82"
Cohesion: 0.24
Nodes (10): VoucherRequestAction(), VoucherRequestActionProps, VoucherStepperVoucherStep(), VoucherStepperVoucherStepProps, getVoucherRequestFn, useGetVoucherRequest(), VoucherRequestParams, voucherRequestQuery() (+2 more)

### Community 83 - "Community 83"
Cohesion: 0.13
Nodes (12): confirmResetPasswordErrorsSchema, confirmResetPasswordSuccessSchema, requestResetPasswordErrorsSchema, requestResetPasswordSuccessSchema, ConfirmResetPasswordErrors, confirmResetPasswordFn, ConfirmResetPasswordSuccess, ConfirmResetPasswordWire (+4 more)

### Community 84 - "Community 84"
Cohesion: 0.17
Nodes (11): GoogleLoginArgs, googleLoginArgsSchema, GoogleLoginErrors, googleLoginErrorsSchema, googleLoginExitSchema, GoogleLoginResult, GoogleLoginSuccess, googleLoginSuccessSchema (+3 more)

### Community 85 - "Community 85"
Cohesion: 0.20
Nodes (9): Current Repository Status, Optional Telemetry Environment Variables (server-only), Performance Monitoring Checklist, Production Readiness Checklist, Recommended Production Defaults, Release Gates, Required Environment Variables, Security Considerations (+1 more)

### Community 86 - "Community 86"
Cohesion: 0.19
Nodes (10): QuizStep, QuizStepper(), QuizStepperContext, QuizStepperContextType, QuizStepperProps, useQuizStepper(), CelebrationParticle, formatTime() (+2 more)

### Community 87 - "Community 87"
Cohesion: 0.18
Nodes (10): VoucherRequest, voucherRequestSchema, voucherRequestStatusSchema, VoucherRequestNotFoundError, voucherRequestNotFoundErrorSchema, GetVoucherRequestArgs, getVoucherRequestArgsSchema, GetVoucherRequestErrors (+2 more)

### Community 88 - "Community 88"
Cohesion: 0.07
Nodes (29): loginErrorsSchema, loginSuccessSchema, logoutErrorsSchema, logoutSuccessSchema, DeleteAccountArgs, deleteAccountErrorsSchema, deleteAccountSuccessSchema, DeleteAccountErrors (+21 more)

### Community 89 - "Community 89"
Cohesion: 0.29
Nodes (6): Best Practices for Workflow, Code Quality Standards, Code Structure & Modularity, Documentation & Explainability, Planning & Task Management, Test-Driven Development Workflow

### Community 90 - "Community 90"
Cohesion: 0.67
Nodes (6): build_app(), copy_instrumentation(), copy_pwa_runtime_files(), log(), remove_temporary_artifacts(), app.sh script

### Community 91 - "Community 91"
Cohesion: 0.18
Nodes (9): isAuthenticated, IsAuthenticatedErrors, IsAuthenticatedSuccess, IsAuthenticatedWire, getLoggedUserErrorsSchema, getLoggedUserSuccessSchema, AccessTokenPayload, accessTokenPayloadSchema (+1 more)

### Community 92 - "Community 92"
Cohesion: 0.26
Nodes (3): useStartChoiceQuestion(), ChoiceQuestionToChoiceQuestionStrategy, SequenceOrderToChoiceQuestionStrategy

### Community 93 - "Community 93"
Cohesion: 0.22
Nodes (8): GetExploreSequenceOrderArgs, getExploreSequenceOrderArgsSchema, GetExploreSequenceOrderErrors, getExploreSequenceOrderErrorsSchema, getExploreSequenceOrderExitSchema, GetExploreSequenceOrderResult, GetExploreSequenceOrderSuccess, getExploreSequenceOrderSuccessSchema

### Community 103 - "Community 103"
Cohesion: 0.16
Nodes (15): fetch(), fetch(), getLivenessResponse(), getReadinessResponse(), HealthResponse, processSnapshot(), ReadyResponse, EXCLUDED_EXACT (+7 more)

### Community 106 - "Community 106"
Cohesion: 0.25
Nodes (7): GetStartedQuizArgs, getStartedQuizArgsSchema, GetStartedQuizErrors, getStartedQuizExitSchema, GetStartedQuizResult, GetStartedQuizSuccess, getStartedQuizSuccessSchema

### Community 111 - "Community 111"
Cohesion: 0.29
Nodes (6): RegisterErrors, registerFn, RegisterSuccess, RegisterWire, registerErrorsSchema, registerSuccessSchema

### Community 112 - "Community 112"
Cohesion: 0.29
Nodes (6): SubmitVoucherErrors, submitVoucherFn, SubmitVoucherSuccess, SubmitVoucherWire, submitVoucherErrorsSchema, submitVoucherSuccessSchema

## Knowledge Gaps
- **1047 isolated node(s):** `husky.sh script`, `$schema`, `style`, `rsc`, `tsx` (+1042 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CategoryContentItem` connect `Community 27` to `Community 72`, `Community 104`, `Community 42`, `Community 44`, `Community 77`, `Community 78`, `Community 12`, `Community 48`, `Community 80`, `Community 52`, `Community 86`, `Community 22`, `Community 25`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 12` to `Community 32`, `Community 34`, `Community 35`, `Community 68`, `Community 4`, `Community 72`, `Community 42`, `Community 77`, `Community 79`, `Community 17`, `Community 54`, `Community 25`, `Community 26`, `Community 60`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `instanceFactory()` connect `Community 19` to `Community 1`, `Community 2`, `Community 5`, `Community 8`, `Community 9`, `Community 21`, `Community 23`, `Community 24`, `Community 28`, `Community 30`, `Community 33`, `Community 36`, `Community 37`, `Community 49`, `Community 51`, `Community 56`, `Community 65`, `Community 66`, `Community 84`, `Community 87`, `Community 88`, `Community 93`, `Community 106`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `style` to the rest of the system?**
  _1047 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06265664160401002 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06207482993197279 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.07435897435897436 - nodes in this community are weakly interconnected._