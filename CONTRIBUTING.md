# Contributing to Arrow E-commerce

First off, thank you for considering contributing to Arrow E-commerce! It's people like you that make this project great.

## Code of Conduct

This project and everyone participating in it is expected to uphold professional behavior. By participating, you are expected to maintain a respectful and collaborative environment.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When you create a bug report, include as many details as possible:

**Great Bug Reports** include:
- A quick summary and/or background
- Steps to reproduce (be specific!)
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:
- A clear and descriptive title
- A detailed description of the proposed enhancement
- Explain why this enhancement would be useful

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Write clear code** that follows the project's style guide
3. **Test your changes** - ensure all tests pass
4. **Update documentation** if needed
5. **Write a clear commit message** using conventional commits

## Development Process

### Setup

```bash
# Clone your fork
git clone https://github.com/your-username/arrow-ecommerce.git

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git commit -m "feat: add amazing feature"
   ```

3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve navbar overflow on mobile"
git commit -m "docs: update installation instructions"
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Properly type all functions and variables
- Avoid `any` types

### Code Style

- Run `pnpm check` before committing
- Run `pnpm fix` to auto-format
- Follow Biome configuration
- Use meaningful variable and function names

### Testing

- Write tests for new features
- Maintain or improve test coverage
- Run `pnpm test` before submitting PR
- Use React Testing Library for component tests

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Files/Folders**: kebab-case (`user-settings/`)

## Project Structure

```
arrow-ecommerce/
├── apps/
│   └── web/          # Next.js application
├── packages/
│   ├── ui/           # Shared UI components
│   ├── ui-theme/     # Design system theme
│   ├── utils/        # Shared utilities
│   └── config/       # Shared configurations
```

## Adding Dependencies

- Use `pnpm add` in the appropriate package
- Justify new dependencies in your PR
- Keep dependencies up to date
- Prefer workspace dependencies for internal packages

## Pull Request Process

1. **Update documentation** for any changed functionality
2. **Add tests** for new features
3. **Run all quality checks**:
   ```bash
   pnpm test
   pnpm type-check
   pnpm check
   pnpm build
   ```
4. **Link any related issues** in your PR description
5. **Wait for review** from maintainers
6. **Address review feedback** promptly

## Review Process

- PRs require at least one approval
- Automated checks must pass (CI, tests, linting)
- Maintainers may request changes
- Be patient and respectful during review

## Getting Help

- 💬 **Questions?** Open a GitHub Discussion
- 🐛 **Found a bug?** Create an issue
- 💡 **Have an idea?** Start a discussion first

## Recognition

Contributors will be recognized in:
- The project README
- Release notes
- GitHub contributors page

Thank you for contributing! 🎉
