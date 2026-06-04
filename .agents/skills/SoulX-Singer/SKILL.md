```markdown
# SoulX-Singer Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the SoulX-Singer TypeScript codebase. You'll learn how to structure files, write imports and exports, and follow the project's commit and testing practices. This guide is ideal for contributors seeking to maintain consistency and quality in the codebase.

## Coding Conventions

### File Naming
- Use **snake_case** for all file names.
  - Example:  
    ```
    song_utils.ts
    audio_processor.test.ts
    ```

### Import Style
- Use **relative imports** for referencing other modules.
  - Example:
    ```typescript
    import { processAudio } from './audio_processor';
    ```

### Export Style
- Use **named exports** for all exported functions, types, and constants.
  - Example:
    ```typescript
    // In song_utils.ts
    export function getSongTitle(id: string): string { ... }
    ```

### Commit Patterns
- Commit messages are **freeform** with no enforced prefixes.
- Typical message length is around 58 characters.
  - Example:
    ```
    Add pitch detection algorithm for improved accuracy
    ```

## Workflows

### Adding a New Utility Module
**Trigger:** When you need to add reusable logic or helpers.
**Command:** `/add-utility-module`

1. Create a new file in snake_case (e.g., `new_util.ts`).
2. Implement your functions using named exports.
3. Use relative imports to include dependencies.
4. Write corresponding tests in a file named `new_util.test.ts`.
5. Commit your changes with a descriptive message.

### Writing and Running Tests
**Trigger:** When you add or modify code that requires testing.
**Command:** `/run-tests`

1. Create a test file matching `*.test.*` (e.g., `audio_processor.test.ts`).
2. Write your tests using the project's preferred (unspecified) framework.
3. Run the tests using the project's test runner (framework not detected—consult project docs or package.json).
4. Ensure all tests pass before committing.

## Testing Patterns

- Test files are named using the pattern `*.test.*` (e.g., `feature.test.ts`).
- The specific testing framework is **unknown**; check project documentation or configuration for details.
- Place test files alongside the modules they test or in a dedicated test directory if present.

## Commands
| Command              | Purpose                                         |
|----------------------|-------------------------------------------------|
| /add-utility-module  | Scaffold a new utility module with tests        |
| /run-tests           | Run all test files matching `*.test.*`          |
```
