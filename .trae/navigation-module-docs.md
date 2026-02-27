# Navigation Module Documentation

## Overview

The Navigation Module (`src/modules/shared/navigation/`) provides a comprehensive system for managing content navigation within the Loops PWA. It handles navigation between skills, quizzes, and other learning content with proper validation, completion tracking, and state management.

## Architecture

The navigation system follows a layered architecture with clear separation of concerns:

```
src/modules/shared/navigation/
├── hooks/
│   └── use-content-navigation.ts    # Main navigation hook
├── managers/
│   ├── navigation-manager.ts        # Core navigation orchestration
│   ├── quiz-navigation-manager.ts   # Quiz-specific navigation
│   └── skill-navigation-manager.ts  # Skill-specific navigation
├── services/
│   ├── navigation-completion-service.ts  # Completion validation
│   ├── quiz-completion-service.ts        # Quiz completion logic
│   └── skill-completion-service.ts       # Skill completion logic
├── strategies/
│   ├── base-navigation-strategy.ts       # Base strategy interface
│   ├── quiz-to-quiz-strategy.ts         # Quiz navigation strategies
│   ├── quiz-to-skill-strategy.ts
│   ├── skill-to-quiz-strategy.ts
│   └── skill-to-skill-strategy.ts       # Skill navigation strategies
├── utils/
│   └── optimized-strategy-selector.ts   # Strategy selection logic
├── types/
│   └── navigation-types.ts              # Type definitions
└── index.ts                             # Public API exports
```

## Core Components

### 1. useContentNavigation Hook

The main entry point for navigation functionality. Provides:

- **Navigation Actions**: `navigateToNext()`, `navigateToPrevious()`, `handleBackNavigation()`
- **State Checks**: `canNavigateNext()`, `canNavigatePrevious()`
- **Completion Utilities**: `validateAndStartItem()`, `isItemCompleted()`
- **Current State**: Access to `selectedItem`, `navigationState`

```typescript
const {
  navigateToNext,
  navigateToPrevious,
  canNavigateNext,
  canNavigatePrevious,
  selectedItem,
  navigationState,
  validateAndStartItem,
  isItemCompleted,
} = useContentNavigation({ categoryId })
```

### 2. Navigation Manager

Orchestrates navigation logic by:

- Selecting appropriate navigation strategies
- Coordinating between different content types
- Managing navigation state transitions
- Handling complex navigation scenarios

### 3. Completion Services

Handle validation and completion tracking:

- **NavigationCompletionService**: Main completion orchestrator
- **QuizCompletionService**: Quiz-specific completion logic
- **SkillCompletionService**: Skill-specific completion logic

### 4. Navigation Strategies

Implement specific navigation patterns:

- **Quiz-to-Quiz**: Direct quiz progression
- **Quiz-to-Skill**: Transition from quiz to skill
- **Skill-to-Quiz**: Transition from skill to quiz
- **Skill-to-Skill**: Direct skill progression

## Key Features

### Smart Navigation

The system automatically determines the best navigation approach:

1. **Simple Navigation**: For straightforward next/previous navigation when items are completed
2. **Strategy-Based Navigation**: For complex scenarios requiring validation and state management
3. **Completion Validation**: Ensures users can only navigate to appropriate content

### Error Handling

Uses the Effect package for comprehensive error handling:

```typescript
type NavigationError =
  | { _tag: "NoNextItem" }
  | { _tag: "NoPreviousItem" }
  | { _tag: "CompletionRequired" }
  | { _tag: "ValidationFailed" }
  | { _tag: "InvalidContentType" }
  | { _tag: "FetchError" }
  | { _tag: "RouterError" }
  | { _tag: "NoStrategyFound" }
```

### State Management

Integrates with:

- **TanStack Router**: For URL-based navigation
- **Selected Content Context**: For maintaining current item state
- **TanStack Query**: For data invalidation and caching

## Usage Examples

### Basic Navigation

```typescript
function ContentNavigationButtons() {
  const {
    navigateToNext,
    navigateToPrevious,
    canNavigateNext,
    canNavigatePrevious
  } = useContentNavigation({ categoryId })

  return (
    <div>
      <button
        onClick={navigateToPrevious}
        disabled={!canNavigatePrevious}
      >
        Previous
      </button>
      <button
        onClick={navigateToNext}
        disabled={!canNavigateNext}
      >
        Next
      </button>
    </div>
  )
}
```

### Completion Checking

```typescript
function ContentItem({ item }: { item: CategoryContentItem }) {
  const { isItemCompleted, validateAndStartItem } = useContentNavigation()

  const completed = isItemCompleted(item)

  const handleStart = async () => {
    const canStart = await validateAndStartItem(item)
    if (canStart) {
      // Proceed with starting the item
    }
  }

  return (
    <div>
      <h3>{item.title}</h3>
      {completed ? (
        <span>✅ Completed</span>
      ) : (
        <button onClick={handleStart}>Start</button>
      )}
    </div>
  )
}
```

## Extension Guidelines

### Adding New Content Types

1. **Create Completion Service**: Implement content-specific completion logic
2. **Add Navigation Strategies**: Create strategies for navigating to/from the new content type
3. **Update Type Definitions**: Add new content types to `navigation-types.ts`
4. **Register Strategies**: Update strategy selector to include new strategies

### Custom Navigation Logic

1. **Extend Base Strategy**: Implement `BaseNavigationStrategy` interface
2. **Register Strategy**: Add to strategy selector with appropriate conditions
3. **Update Manager**: Ensure navigation manager can handle new scenarios

### Error Handling

1. **Define Error Types**: Add new error variants to `NavigationError` union
2. **Handle in Hook**: Update error handling in `useContentNavigation`
3. **User Feedback**: Provide appropriate user messages for new error types

## Best Practices

### Performance

- Navigation state is memoized to prevent unnecessary re-renders
- Strategy selection is optimized for common navigation patterns
- Query invalidation is targeted to specific data that needs refreshing

### Type Safety

- All navigation operations are fully typed
- Effect package ensures error paths are handled
- Zod validation for all API responses

### User Experience

- Loading states during navigation transitions
- Optimistic updates where appropriate
- Clear error messages for navigation failures
- Smooth transitions with proper state management

## Testing

### Unit Tests

Test individual components:

- Navigation strategies
- Completion services
- Utility functions

### Integration Tests

Test navigation flows:

- Complete navigation sequences
- Error handling scenarios
- State management integration

### E2E Tests

Test user workflows:

- Complete learning paths
- Navigation between different content types
- Error recovery scenarios

## Troubleshooting

### Common Issues

1. **Navigation Not Working**: Check if `selectedItem` is properly set in context
2. **Can't Navigate Next**: Verify current item completion status
3. **Router Errors**: Ensure navigation URLs match route definitions
4. **State Inconsistency**: Check query invalidation after navigation

### Debug Tools

- Use React DevTools to inspect navigation state
- Check browser network tab for API calls
- Use Effect debugging for error path analysis
- Console logging in development mode

## Migration Notes

### From Previous Versions

The navigation system has evolved to provide better separation of concerns and improved error handling. When migrating:

1. Update imports to use the main hook
2. Replace direct manager usage with hook methods
3. Update error handling to use Effect patterns
4. Ensure completion services are properly configured

### Future Improvements

- Enhanced caching strategies
- Offline navigation support
- Advanced progress tracking
- Performance optimizations for large content sets

---

_This documentation is maintained as part of the Loops PWA project. For questions or contributions, please refer to the main project documentation._
