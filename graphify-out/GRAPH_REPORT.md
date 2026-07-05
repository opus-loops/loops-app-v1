# Graph Report - loops-app-v1 (2026-07-05)

## Corpus Check

- 452 files · ~1,817,375 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 2193 nodes · 5006 edges · 115 communities (105 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness

- Built from commit: `a4cef2c7`
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
- [[_COMMUNITY_Community 114|Community 114]]

## God Nodes (most connected - your core abstractions)

1. `instanceFactory()` - 88 edges
2. `parseApiResponse()` - 83 edges
3. `parseEffectSchema()` - 78 edges
4. `cn()` - 77 edges
5. `CategoryContentItem` - 65 edges
6. `useGlobalError()` - 43 edges
7. `invalidInputFactory()` - 42 edges
8. `UseCaseErrorSchema` - 41 edges
9. `handleServerFnFailure()` - 41 edges
10. `Button()` - 35 edges

## Surprising Connections (you probably didn't know these)

- `BulletElement()` --calls--> `cn()` [EXTRACTED]
  src/components/ui/skill-json.tsx → src/modules/shared/lib/utils.ts
- `DialogFooter()` --calls--> `cn()` [EXTRACTED]
  src/modules/shared/components/ui/dialog.tsx → src/modules/shared/lib/utils.ts
- `resolveAxiosUrl()` --calls--> `normalizeApiResource()` [EXTRACTED]
  src/server/telemetry/setup.ts → src/server/telemetry/resource.ts
- `fetch()` --calls--> `handleInstrumentedRequest()` [EXTRACTED]
  src/entry-server.tsx → src/server/telemetry/request.ts
- `ConfirmAccountForm()` --calls--> `useToast()` [EXTRACTED]
  src/modules/account-management/features/account-confirmation/services/confirm-account-form.tsx → src/modules/shared/hooks/use-toast.ts

## Import Cycles

- 1-file cycle: `src/server/telemetry/effect.ts -> src/server/telemetry/effect.ts`
- 1-file cycle: `src/server/telemetry/browser-session.ts -> src/server/telemetry/browser-session.ts`
- 3-file cycle: `src/routeTree.gen.ts -> src/routes/__root.tsx -> src/router.tsx -> src/routeTree.gen.ts`

## Communities (115 total, 10 thin omitted)

### Community 0 - "Community 0"

Cohesion: 0.06
Nodes (44): startChoiceQuestionErrorsSchema, startChoiceQuestionSuccessSchema, useQuizStepper(), initialNavigationState, SelectedSubQuizContext, SelectedSubQuizContextType, SelectedSubQuizProvider(), SubQuizNavigationState (+36 more)

### Community 1 - "Community 1"

Cohesion: 0.06
Nodes (48): StartChoiceQuestionArgs, startChoiceQuestionArgsSchema, StartChoiceQuestionErrors, StartChoiceQuestionExit, startChoiceQuestionExitSchema, StartChoiceQuestionResult, StartChoiceQuestionSuccess, ValidateChoiceQuestionArgs (+40 more)

### Community 2 - "Community 2"

Cohesion: 0.07
Nodes (29): ConfirmAccountArgs, confirmAccountArgsSchema, ConfirmAccountErrors, confirmAccountExitSchema, ConfirmAccountResult, ConfirmAccountSuccess, RefreshArgs, refreshArgsSchema (+21 more)

### Community 3 - "Community 3"

Cohesion: 0.13
Nodes (15): BackButton(), BackButtonProps, CategoriesList(), CategoriesListProps, CategoryActionButton(), CategoryActionButtonProps, CategoryCard(), CategoryCardProps (+7 more)

### Community 4 - "Community 4"

Cohesion: 0.13
Nodes (16): ConfirmAccountDialog(), ConfirmAccountDialogProps, FreeTrialDialogStep, SelectionStepProps, VoucherStepperDialog(), VoucherStepperDialogProps, VoucherStepProps, useStartCategory() (+8 more)

### Community 5 - "Community 5"

Cohesion: 0.05
Nodes (54): GetExploreCategoryArgs, getExploreCategoryArgsSchema, GetExploreCategoryErrors, getExploreCategoryErrorsSchema, getExploreCategoryExitSchema, GetExploreCategoryResult, GetExploreCategorySuccess, getExploreCategorySuccessSchema (+46 more)

### Community 6 - "Community 6"

Cohesion: 0.05
Nodes (39): devDependencies, esbuild, eslint, eslint-config-prettier, @eslint/css, @eslint/js, @eslint/json, @eslint/markdown (+31 more)

### Community 7 - "Community 7"

Cohesion: 0.08
Nodes (33): Route, Route, Route, Route, Route, Route, Route, Route (+25 more)

### Community 8 - "Community 8"

Cohesion: 0.06
Nodes (49): startedQuizSchema, GetExploreQuizArgs, getExploreQuizArgsSchema, GetExploreQuizErrors, getExploreQuizErrorsSchema, getExploreQuizExitSchema, getExploreQuizFactory(), GetExploreQuizResult (+41 more)

### Community 9 - "Community 9"

Cohesion: 0.07
Nodes (29): CategoryAlreadyStartedError, categoryAlreadyStartedErrorSchema, CategoryAlreadyStartedWithSubscriptionError, categoryAlreadyStartedWithSubscriptionErrorSchema, CategoryNotPublicError, categoryNotPublicErrorSchema, InvalidExpiredVoucherError, invalidExpiredVoucherErrorSchema (+21 more)

### Community 10 - "Community 10"

Cohesion: 0.08
Nodes (27): CredentialResponse, GsiButtonConfiguration, IdConfiguration, LoginGoogle(), PromptMomentNotification, RevocationResponse, Window, RegisterCredentials (+19 more)

### Community 11 - "Community 11"

Cohesion: 0.05
Nodes (37): dependencies, axios, @azure/monitor-opentelemetry, class-variance-authority, clsx, date-fns, effect, eslint-plugin-perfectionist (+29 more)

### Community 12 - "Community 12"

Cohesion: 0.08
Nodes (38): CountdownTimer(), CountdownTimerProps, GlobalErrorComponent(), GlobalErrorComponentProps, HomeSkeleton(), NotFoundComponent(), SpaceBackground(), CertificateCard() (+30 more)

### Community 13 - "Community 13"

Cohesion: 0.06
Nodes (32): AppLanguage, BirthDateCalendar(), BirthDateCalendarProps, backgroundOptions, codingExperienceOptions, durationOptions, genderOptions, goalsOptions (+24 more)

### Community 14 - "Community 14"

Cohesion: 0.43
Nodes (9): CategorySelectionShell(), ComingSoonScreen(), ConfirmationShell(), authenticatedQuery, useAuth(), BottomTabNavigator(), OnboardingShell(), instrumentBeforeLoad() (+1 more)

### Community 15 - "Community 15"

Cohesion: 0.06
Nodes (39): GetExploreChoiceQuestionArgs, getExploreChoiceQuestionArgsSchema, GetExploreChoiceQuestionErrors, getExploreChoiceQuestionErrorsSchema, getExploreChoiceQuestionExitSchema, GetExploreChoiceQuestionResult, GetExploreChoiceQuestionSuccess, getExploreChoiceQuestionSuccessSchema (+31 more)

### Community 16 - "Community 16"

Cohesion: 0.06
Nodes (30): 🏗️ Architecture, Architecture Principles, Available Scripts, Build for Production, Code Style, 🤝 Contributing, 🚀 Deployment, 🔧 Development Guidelines (+22 more)

### Community 17 - "Community 17"

Cohesion: 0.21
Nodes (9): CodeInputGroup(), CodeInputGroupProps, DigitInput, DigitInputProps, FreeTrialDialogProps, FreeTrialDialogStep, VoucherSubmissionForm(), VoucherSubmissionFormProps (+1 more)

### Community 18 - "Community 18"

Cohesion: 0.04
Nodes (45): 1. Environment, 2. Confirm telemetry is up, 3. Generate traffic, 4. Correlation from the browser, All API calls with caller + session context, API call tracing and caller context, API error rate by resource and caller, Application Insights portal (UI) (+37 more)

### Community 19 - "Community 19"

Cohesion: 0.17
Nodes (34): confirmAccountFactory(), requestConfirmFactory(), googleLoginFactory(), loginFactory(), logoutFactory(), refreshAccessToken(), getExploreCategoryFactory(), getExploreCategoryItemFactory() (+26 more)

### Community 20 - "Community 20"

Cohesion: 0.32
Nodes (6): startQuizErrorsSchema, startQuizSuccessSchema, StartQuizErrors, startQuizFn, StartQuizSuccess, StartQuizWire

### Community 21 - "Community 21"

Cohesion: 0.10
Nodes (20): MaxFreeItemsReachedError, maxFreeItemsReachedErrorSchema, PreviousItemNotCompletedError, previousItemNotCompletedErrorSchema, QuizAlreadyStartedError, quizAlreadyStartedErrorSchema, SkillAlreadyStartedError, skillAlreadyStartedErrorSchema (+12 more)

### Community 22 - "Community 22"

Cohesion: 0.14
Nodes (17): UseContentNavigationProps, INavigationCompletionService, NavigationCompletionService, IQuizCompletionService, ISkillCompletionService, StartSkillErrors, startSkillFn, StartSkillSuccess (+9 more)

### Community 23 - "Community 23"

Cohesion: 0.05
Nodes (48): GoogleLoginArgs, googleLoginArgsSchema, GoogleLoginErrors, googleLoginErrorsSchema, googleLoginExitSchema, GoogleLoginResult, GoogleLoginSuccess, googleLoginSuccessSchema (+40 more)

### Community 24 - "Community 24"

Cohesion: 0.09
Nodes (21): GetExploreCategoryItemArgs, getExploreCategoryItemArgsSchema, GetExploreCategoryItemErrors, getExploreCategoryItemErrorsSchema, GetExploreCategoryItemExit, getExploreCategoryItemExitSchema, GetExploreCategoryItemResult, GetExploreCategoryItemSuccess (+13 more)

### Community 25 - "Community 25"

Cohesion: 0.18
Nodes (17): CategoryItemProps, FreeTrialDialog(), QuizItemCircle(), QuizItemCircleProps, SkillItemCircle(), SkillItemCircleProps, useSelectedContent(), BookIcon() (+9 more)

### Community 26 - "Community 26"

Cohesion: 0.12
Nodes (12): BulletContent, BulletElement(), BulletElementProps, BulletGroupProps, CTAElementProps, ImageElementProps, renderSkillElements(), SkillContentDisplay() (+4 more)

### Community 27 - "Community 27"

Cohesion: 0.24
Nodes (8): CategoryContentItem, NavigationManager, IQuizNavigationManager, QuizNavigationManager, ISkillNavigationManager, SkillNavigationManager, INavigationManager, NavigationError

### Community 28 - "Community 28"

Cohesion: 0.08
Nodes (23): PhoneNumberAlreadyUsedError, phoneNumberAlreadyUsedErrorSchema, TakenUsernameError, takenUsernameErrorSchema, UserAlreadyExistError, userAlreadyExistErrorSchema, updatePreferencesArgsSchema, UpdatePreferencesErrors (+15 more)

### Community 29 - "Community 29"

Cohesion: 0.12
Nodes (19): CategorySelectionScreen(), deleteAccountFn, exploreCategoriesFn, getQuizContentFn, getSubQuizContentFn, exploreCategoriesQuery(), useExploreCategories(), QuizContentParams (+11 more)

### Community 30 - "Community 30"

Cohesion: 0.20
Nodes (9): GetCompletedSequenceOrderArgs, getCompletedSequenceOrderArgsSchema, GetCompletedSequenceOrderErrors, getCompletedSequenceOrderErrorsSchema, GetCompletedSequenceOrderExit, getCompletedSequenceOrderExitSchema, GetCompletedSequenceOrderResult, GetCompletedSequenceOrderSuccess (+1 more)

### Community 31 - "Community 31"

Cohesion: 0.06
Nodes (35): Architecture, Auto-instrumentation disabled for incoming HTTP, Automatic log events, Azure Monitor OpenTelemetry (server-only), Build and runtime, Call context modules (`src/modules/shared/telemetry/` + query client), Changed files, Configuration and docs (+27 more)

### Community 32 - "Community 32"

Cohesion: 0.12
Nodes (21): confirmAccountErrorsSchema, confirmAccountSuccessSchema, requestConfirmErrorsSchema, requestConfirmSuccessSchema, ConfirmAccountErrors, confirmAccountFn, ConfirmAccountSuccess, ConfirmAccountWire (+13 more)

### Community 33 - "Community 33"

Cohesion: 0.11
Nodes (19): RequestConfirmErrors, requestConfirmExitSchema, RequestConfirmResult, RequestConfirmSuccess, InvalidOperationError, invalidOperationErrorSchema, UpdateCurrentCategoryArgs, updateCurrentCategoryArgsSchema (+11 more)

### Community 34 - "Community 34"

Cohesion: 0.22
Nodes (8): ChoiceAnswerFeedbackVariant, getChoiceAnswerFeedbackVariant(), ChoiceQuestionComponent, ChoiceQuestionComponentProps, SubQuizRef, ChoiceReviewState, getChoiceReviewState(), useValidateChoiceQuestion()

### Community 35 - "Community 35"

Cohesion: 0.16
Nodes (9): ResetPasswordFieldName, ResetPasswordForm(), ResetPasswordStep, ResetPasswordStepperContext, ResetPasswordStepperContextType, ResetPasswordStepperProvider(), useResetPasswordStepper(), ResetPasswordSuccessPanel() (+1 more)

### Community 36 - "Community 36"

Cohesion: 0.14
Nodes (16): SubQuiz, subQuizSchema, GetExploreSubQuizArgs, getExploreSubQuizArgsSchema, GetExploreSubQuizErrors, getExploreSubQuizErrorsSchema, getExploreSubQuizExitSchema, getExploreSubQuizFactory() (+8 more)

### Community 37 - "Community 37"

Cohesion: 0.14
Nodes (13): EmailNotFoundError, emailNotFoundErrorSchema, RequestResetPasswordArgs, requestResetPasswordArgsSchema, RequestResetPasswordErrors, requestResetPasswordErrorsSchema, RequestResetPasswordResult, RequestResetPasswordSuccess (+5 more)

### Community 38 - "Community 38"

Cohesion: 0.10
Nodes (19): 1. Overview, 2. Tech Stack & Architecture, 3. Sprint Planning (mapped to use cases), 4. Detailed Implementation Planning, 5. Cross-cutting Concerns, **Architecture Layers**, **Planning Document – Loops PWA**, **Sprint 1 – Authentication & Account** (+11 more)

### Community 39 - "Community 39"

Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 40 - "Community 40"

Cohesion: 0.14
Nodes (16): apiCallContextJsonSchema, apiCallContextSchema, apiCallSourceSchema, apiCallStackJsonSchema, parseCallContextHeader(), parseCallStackHeader(), serializeCallContext(), serializeCallStack() (+8 more)

### Community 41 - "Community 41"

Cohesion: 0.12
Nodes (25): callContextStorage, getCallContext(), getCallContextStack(), runWithCallContext(), runWithCallContextStack(), LOG_LEVELS, parseBoolean(), parseLogLevel() (+17 more)

### Community 42 - "Community 42"

Cohesion: 0.20
Nodes (8): FirstInstallShell(), FirstInstallShellProps, LanguageId, LanguageSelectionScreen(), supportedLanguages, deletePendingLanguageFn, getPendingLanguageFn, setPendingLanguageFn

### Community 43 - "Community 43"

Cohesion: 0.16
Nodes (15): CategoryDetails(), CategoryDetailsWrapper(), CategoryDetailsWrapperProps, ContentList(), ContentListWrapper(), ContentListWrapperProps, HomeScreen(), HomeScreenProps (+7 more)

### Community 44 - "Community 44"

Cohesion: 0.09
Nodes (20): CategoryItemCircle(), CategoryMapping(), QuizActionButton(), QuizActionButtonProps, CategoryItemProps, CategoryMappingProps, CompletedSkill, completedSkillSchema (+12 more)

### Community 45 - "Community 45"

Cohesion: 0.23
Nodes (12): bootstrapBrowserSessionId(), ensureBrowserSessionId(), getBrowserSessionId(), persistBrowserSessionId(), syncBrowserSessionIdFromResponse(), createBrowserSessionId(), normalizeBrowserSessionId(), resolveBrowserSessionId() (+4 more)

### Community 46 - "Community 46"

Cohesion: 0.12
Nodes (15): Accessibility, Animations and Transitions, CSS Best Practices, Forms, HTML Best Practices, Key Principles, Layout, Media (+7 more)

### Community 47 - "Community 47"

Cohesion: 0.31
Nodes (16): instrumentRefreshRequest(), runTelemetryExit(), buildCorrelationAttributes(), instrumentApiClient(), instrumentLoader(), instrumentServerFunction(), logServerError(), logServerInfo() (+8 more)

### Community 48 - "Community 48"

Cohesion: 0.10
Nodes (25): CategoryContentNavigationHeader(), CategoryContentNavigationHeaderProps, QuizContentScreen(), QuizContentScreenProps, QuizStep, QuizStepper(), QuizStepperContext, QuizStepperContextType (+17 more)

### Community 49 - "Community 49"

Cohesion: 0.16
Nodes (11): Skill, skillSchema, GetExploreSkillArgs, getExploreSkillArgsSchema, GetExploreSkillErrors, getExploreSkillExitSchema, GetExploreSkillResult, GetExploreSkillSuccess (+3 more)

### Community 50 - "Community 50"

Cohesion: 0.14
Nodes (13): compilerOptions, baseUrl, exactOptionalPropertyTypes, jsx, module, moduleResolution, paths, resolveJsonModule (+5 more)

### Community 51 - "Community 51"

Cohesion: 0.13
Nodes (23): createInstrumentedQueryClient(), formatQueryKey(), instrumentMutationCache(), instrumentQueryCache(), summarizeQueryFilter(), ApiCallContext, ApiCallSource, clientCallContextStack (+15 more)

### Community 52 - "Community 52"

Cohesion: 0.16
Nodes (12): SelectedContentScreen(), SelectedContentWrapper(), SelectedContentWrapperProps, initialNavigationState, NavigationState, SelectedContentContext, SelectedContentContextType, SelectedContentProvider() (+4 more)

### Community 53 - "Community 53"

Cohesion: 0.13
Nodes (27): isServerErrorStatus(), statusClass(), toError(), isSensitiveKey(), redactAttributes(), redactErrorMessage(), redactString(), redactValue() (+19 more)

### Community 54 - "Community 54"

Cohesion: 0.15
Nodes (13): DeleteAccountConfirmFormValues, LogoutConfirmDialog(), LogoutConfirmDialogProps, SettingsRowProps, SettingsScreen(), SettingsScreenProps, shouldShowConfirmAccountAction(), useDeleteAccount() (+5 more)

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

Cohesion: 0.25
Nodes (7): ProgressBar(), OnboardingStep, OnboardingStepper(), OnboardingStepperProps, stepOrder, StepperContext, StepperContextType

### Community 61 - "Community 61"

Cohesion: 0.18
Nodes (10): pre-commit, husky, hooks, license, lint-staged, \*.{js,jsx,ts,tsx,json,css,scss,md}, main, name (+2 more)

### Community 62 - "Community 62"

Cohesion: 0.18
Nodes (10): 1. DECONSTRUCT, 2. DIAGNOSE, 3. DEVELOP, 4. DELIVER, OPERATING MODES, OPTIMIZATION TECHNIQUES, PROCESSING FLOW, RESPONSE FORMATS (+2 more)

### Community 63 - "Community 63"

Cohesion: 0.11
Nodes (17): Architecture decisions, Current state (inspected), Environment variables, Files to change, Incoming HTTP, Instrumentation map, Lifecycle, Logs (+9 more)

### Community 64 - "Community 64"

Cohesion: 0.12
Nodes (16): LoginArgs, loginArgsSchema, LoginErrors, loginExitSchema, LoginResult, LoginSuccess, LogoutArgs, logoutArgsSchema (+8 more)

### Community 65 - "Community 65"

Cohesion: 0.20
Nodes (9): GetCompletedChoiceQuestionArgs, getCompletedChoiceQuestionArgsSchema, GetCompletedChoiceQuestionErrors, getCompletedChoiceQuestionErrorsSchema, GetCompletedChoiceQuestionExit, getCompletedChoiceQuestionExitSchema, GetCompletedChoiceQuestionResult, GetCompletedChoiceQuestionSuccess (+1 more)

### Community 66 - "Community 66"

Cohesion: 0.29
Nodes (6): StartCategoryErrors, startCategoryFn, StartCategorySuccess, StartCategoryWire, startCategoryErrorsSchema, startCategorySuccessSchema

### Community 67 - "Community 67"

Cohesion: 0.16
Nodes (11): resources, resolveHeadBrowserSessionId(), setUserTimezoneFn, RouterContext, DefaultErrorComponent(), DefaultNotFoundComponent(), LazyGlobalErrorComponent, LazyNotFoundComponent (+3 more)

### Community 68 - "Community 68"

Cohesion: 0.08
Nodes (27): RegisterForm(), RegisterFormProps, ResetPasswordCodeStep(), ResetPasswordCodeStepProps, ResetPasswordPasswordFieldProps, ResetPasswordPasswordStep(), ResetPasswordPasswordStepProps, ToastOptions (+19 more)

### Community 69 - "Community 69"

Cohesion: 0.20
Nodes (9): 1. Language and Style, 2. UI Components & Forms, 3. Internationalization (i18n), 4. Error Handling, 5. Performance & Data Caching, 6. PWA Best Practices, 7. Layer Interaction & Modularity, 8. Testing & Maintainability (+1 more)

### Community 70 - "Community 70"

Cohesion: 0.22
Nodes (9): ContentScreenSkeleton(), LoadingScreen(), ConfirmationShellProps, hasReachedConfirmationDeadline(), isUserConfirmed(), usePageLoading(), OnboardingShellProps, SelectedContentShell() (+1 more)

### Community 72 - "Community 72"

Cohesion: 0.19
Nodes (10): difficultyConfig, DifficultyTag(), DifficultyTagProps, CategoryItemCardProps, ProgressCircle(), QuizCard(), QuizCardProps, SkillCard() (+2 more)

### Community 73 - "Community 73"

Cohesion: 0.17
Nodes (12): scripts, build, build:instrument, build:raw, dev, lint:fix, lint:format, prepare (+4 more)

### Community 74 - "Community 74"

Cohesion: 0.28
Nodes (6): onboardingErrorsSchema, onboardingSuccessSchema, OnboardingErrors, onboardingFn, OnboardingSuccess, OnboardingWire

### Community 75 - "Community 75"

Cohesion: 0.22
Nodes (8): Character Encoding, CSS and Layout, Form Internationalization, Images and Media, Language Declaration, Numbers, Dates, and Currencies, Semantic Structure, Text Direction

### Community 76 - "Community 76"

Cohesion: 0.33
Nodes (5): ensure_swarm_manager(), login_to_ghcr_if_needed(), main(), write_env_file(), deploy-staging.sh script

### Community 77 - "Community 77"

Cohesion: 0.18
Nodes (10): SkillAlreadyCompletedError, skillAlreadyCompletedErrorSchema, SkillNotFoundError, skillNotFoundErrorSchema, CompleteSkillArgs, completeSkillArgsSchema, CompleteSkillErrors, completeSkillExitSchema (+2 more)

### Community 78 - "Community 78"

Cohesion: 0.29
Nodes (4): CategoryIcon(), FlashIcon(), StarIcon(), UserIcon()

### Community 79 - "Community 79"

Cohesion: 0.27
Nodes (6): ProfileProgressSectionProps, ProfileScreen(), User, GearIcon(), Role, roleSchema

### Community 80 - "Community 80"

Cohesion: 0.28
Nodes (7): useCompleteSkill(), CompleteSkillErrors, completeSkillFn, CompleteSkillSuccess, CompleteSkillWire, completeSkillErrorsSchema, completeSkillSuccessSchema

### Community 81 - "Community 81"

Cohesion: 0.27
Nodes (8): validateSequenceOrderArgsSchema, validateSequenceOrderErrorsSchema, validateSequenceOrderSuccessSchema, ValidateSequenceOrderArgs, ValidateSequenceOrderErrors, validateSequenceOrderFn, ValidateSequenceOrderSuccess, ValidateSequenceOrderWire

### Community 82 - "Community 82"

Cohesion: 0.20
Nodes (8): FetchContentErrors, fetchContentErrorsSchema, fetchContentFn, FetchContentSuccess, FetchContentWire, fetchErrorSchema, networkErrorSchema, validationErrorSchema

### Community 83 - "Community 83"

Cohesion: 0.36
Nodes (4): CategorySelectionShellProps, CategoriesListSkeleton(), CategoryContentSkeleton(), CategoryDetailsSkeleton()

### Community 84 - "Community 84"

Cohesion: 0.32
Nodes (5): OptionCard(), OptionCardProps, variantStyles, ClockIcon(), goalOptions

### Community 85 - "Community 85"

Cohesion: 0.20
Nodes (9): Current Repository Status, Optional Telemetry Environment Variables (server-only), Performance Monitoring Checklist, Production Readiness Checklist, Recommended Production Defaults, Release Gates, Required Environment Variables, Security Considerations (+1 more)

### Community 86 - "Community 86"

Cohesion: 0.36
Nodes (4): AwardIcon(), CodeClipboardIcon(), CodeMessageIcon(), levelOptions

### Community 87 - "Community 87"

Cohesion: 0.36
Nodes (4): GameIcon(), MonitorIcon(), TeacherIcon(), statusOptions

### Community 88 - "Community 88"

Cohesion: 0.10
Nodes (23): logoutErrorsSchema, logoutSuccessSchema, DeleteAccountArgs, deleteAccountArgsSchema, DeleteAccountErrors, deleteAccountErrorsSchema, DeleteAccountResult, DeleteAccountSuccess (+15 more)

### Community 89 - "Community 89"

Cohesion: 0.29
Nodes (6): Best Practices for Workflow, Code Quality Standards, Code Structure & Modularity, Documentation & Explainability, Planning & Task Management, Test-Driven Development Workflow

### Community 90 - "Community 90"

Cohesion: 0.67
Nodes (6): build_app(), copy_instrumentation(), copy_pwa_runtime_files(), log(), remove_temporary_artifacts(), app.sh script

### Community 91 - "Community 91"

Cohesion: 0.32
Nodes (7): createOnboardingForm(), OnboardingFormApi, OnboardingFormContext, OnboardingFormData, OnboardingFormProvider(), OnboardingFormSchema, useOnboarding()

### Community 92 - "Community 92"

Cohesion: 0.39
Nodes (5): getBrowserSessionAttributes(), formatCallPath(), getCallContextAttributes(), getCallStackAttributes(), buildAxiosMetricAttributes()

### Community 93 - "Community 93"

Cohesion: 0.43
Nodes (6): useOnboardingForm(), useOnboardingStepper(), ChooseGoalsStep(), ChooseLevelStep(), ChooseStatusStep(), WelcomeStep()

### Community 103 - "Community 103"

Cohesion: 0.14
Nodes (18): fetch(), fetch(), getLivenessResponse(), getReadinessResponse(), HealthResponse, processSnapshot(), ReadyResponse, getTelemetryStatus() (+10 more)

### Community 106 - "Community 106"

Cohesion: 0.50
Nodes (4): BidirectionalText(), BidirectionalTextProps, splitBidirectionalText(), TextSegment

### Community 111 - "Community 111"

Cohesion: 0.70
Nodes (3): SkillContentRenderer(), skillContentQuery(), useSkillContent()

## Knowledge Gaps

- **963 isolated node(s):** `husky.sh script`, `$schema`, `style`, `rsc`, `tsx` (+958 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 12` to `Community 0`, `Community 32`, `Community 34`, `Community 3`, `Community 68`, `Community 4`, `Community 72`, `Community 10`, `Community 44`, `Community 17`, `Community 84`, `Community 54`, `Community 25`, `Community 26`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `CategoryContentItem` connect `Community 27` to `Community 0`, `Community 72`, `Community 8`, `Community 104`, `Community 44`, `Community 12`, `Community 48`, `Community 112`, `Community 52`, `Community 22`, `Community 25`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `instanceFactory()` connect `Community 19` to `Community 1`, `Community 2`, `Community 5`, `Community 8`, `Community 9`, `Community 15`, `Community 21`, `Community 23`, `Community 24`, `Community 28`, `Community 30`, `Community 33`, `Community 36`, `Community 37`, `Community 49`, `Community 51`, `Community 56`, `Community 64`, `Community 65`, `Community 77`, `Community 88`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `$schema`, `style` to the rest of the system?**
  _963 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05743740795287187 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06144393241167435 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07226890756302522 - nodes in this community are weakly interconnected._
