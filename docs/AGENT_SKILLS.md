# Agent Skills Setup

This document explains how to install and use agent skills for AI-assisted development in this project.

## What are Agent Skills?

Agent skills are modular packages that extend AI agent capabilities with specialized knowledge, workflows, and best practices. They help AI assistants understand:
- Framework-specific patterns (React, Next.js)
- Performance optimization techniques
- Component architecture best practices
- Web design guidelines

## Configuration File

The project uses `.clinerules` (symlinked to `.cursorrules`) to configure agent skills and project-specific guidelines.

**Location**: `/.clinerules`

This file contains:
- References to installed agent skills
- Project structure overview
- Tech stack details
- Project-specific coding guidelines
- Common commands and workflows

## Installing Agent Skills

### Quick Install (All Skills)

```bash
# Install all recommended skills for this project
npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y
npx skills add vercel-labs/next-skills@next-best-practices -g -y
npx skills add vercel-labs/agent-skills@vercel-composition-patterns -g -y
npx skills add vercel-labs/agent-skills@web-design-guidelines -g -y
npx skills add vercel-labs/skills@find-skills -g -y
```

The `-g` flag installs globally (user-level), and `-y` skips confirmation prompts.

### Individual Skills

#### 1. Vercel React Best Practices
Performance optimization for React and Next.js (57 rules across 8 categories)

```bash
npx skills add vercel-labs/agent-skills@vercel-react-best-practices
```

**Use when:**
- Writing new React components
- Implementing data fetching
- Reviewing code for performance issues
- Optimizing bundle size or load times

**Covers:**
- Eliminating waterfalls (Promise.all, Suspense)
- Bundle size optimization (dynamic imports, tree-shaking)
- Server-side performance (React.cache, serialization)
- Client-side data fetching (SWR, deduplication)
- Re-render optimization (memo, useMemo, useCallback)
- JavaScript performance

**Learn more**: https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices

#### 2. Next.js Best Practices
Framework-specific patterns for Next.js

```bash
npx skills add vercel-labs/next-skills@next-best-practices
```

**Use when:**
- Setting up Next.js routes
- Working with Server Components
- Implementing metadata and OG images
- Optimizing images and fonts
- Handling errors and redirects

**Covers:**
- File conventions (page.tsx, layout.tsx, error.tsx)
- RSC boundaries (async components, serialization)
- Async APIs (params, searchParams, cookies, headers)
- Data patterns (Server Components vs Server Actions vs Route Handlers)
- Image and font optimization
- Hydration errors and Suspense boundaries

**Learn more**: https://skills.sh/vercel-labs/next-skills/next-best-practices

#### 3. Vercel Composition Patterns
Component architecture and composition guidelines

```bash
npx skills add vercel-labs/agent-skills@vercel-composition-patterns
```

**Use when:**
- Refactoring components with many boolean props
- Building reusable component libraries
- Designing flexible component APIs
- Working with compound components

**Covers:**
- Avoiding boolean prop proliferation
- Compound components with shared context
- State management patterns (lifting state, context providers)
- React 19 APIs (use() hook, no forwardRef)

**Learn more**: https://skills.sh/vercel-labs/agent-skills/vercel-composition-patterns

#### 4. Web Design Guidelines
Web interface design best practices

```bash
npx skills add vercel-labs/agent-skills@web-design-guidelines
```

**Use when:**
- Reviewing UI/UX implementations
- Ensuring accessibility compliance
- Checking design consistency
- Validating interface patterns

**Learn more**: https://skills.sh/vercel-labs/agent-skills/web-design-guidelines

#### 5. Find Skills
Discover and install additional skills

```bash
npx skills add vercel-labs/skills@find-skills
```

**Use when:**
- Looking for skills for specific tasks
- Exploring available skills
- Need help with a domain-specific problem

**Learn more**: https://skills.sh/vercel-labs/skills/find-skills

## Using Skills in VS Code

### GitHub Copilot
GitHub Copilot automatically reads `.cursorrules` and uses the guidelines when generating code suggestions.

**No additional setup required** - Just ensure `.cursorrules` exists (it's symlinked to `.clinerules`)

### Cursor IDE
Cursor reads `.cursorrules` by default and applies the guidelines to its AI assistant.

### Claude Code (Cline)
Cline reads `.clinerules` automatically when available in the workspace.

### Other AI Assistants
Most modern AI coding assistants will respect workspace configuration files like `.clinerules` or `.cursorrules`.

## Skills CLI Commands

### Common Commands

```bash
# Search for skills
npx skills find [query]

# List installed skills
npx skills list

# Check for updates
npx skills check

# Update all skills
npx skills update

# Remove a skill
npx skills remove <package>@<skill>

# Get help
npx skills help
```

### Examples

```bash
# Find React testing skills
npx skills find react testing

# Find deployment skills
npx skills find deployment

# Find design system skills
npx skills find design system
```

## Project-Specific Guidelines

The `.clinerules` file includes project-specific guidelines for:

### 1. Multi-Brand Architecture (`packages/ui-theme`)
- Inheritance-based theming pattern
- Base tokens + theme overrides
- Bundle optimization strategies
- React theme management components

### 2. Component Development
- shadcn/ui component installation
- Composition patterns
- TypeScript best practices

### 3. Performance Optimization
- Critical priorities (waterfalls, bundle size, server-side)
- Data fetching patterns
- Re-render optimization

### 4. Next.js Patterns
- File conventions
- Async APIs (Next.js 15+)
- Image and font optimization
- Error handling

### 5. State Management
- Client-side hooks
- Server-side patterns
- SWR for data fetching

### 6. Code Quality
- Biome linting/formatting
- TypeScript strict mode
- Test coverage requirements

## How Agents Use These Skills

When you ask an AI assistant to help with code:

1. **Agent reads** `.clinerules` to understand project context
2. **Agent applies** installed skills relevant to the task
3. **Agent follows** project-specific guidelines
4. **Agent generates** code following best practices

### Example Workflow

```
You: "Create a product listing component with filtering"

Agent:
1. Reads .clinerules → understands monorepo structure
2. Applies vercel-react-best-practices → optimizes for performance
3. Applies next-best-practices → uses Server Components
4. Applies vercel-composition-patterns → uses compound components
5. Follows ui-theme guidelines → uses design tokens
6. Generates optimized, project-compliant code
```

## Updating Guidelines

To update project guidelines:

1. Edit `/.clinerules`
2. Commit changes to git
3. Skills will automatically update via `npx skills update`

## Troubleshooting

### Agent not following guidelines?
- Ensure `.clinerules` or `.cursorrules` exists in workspace root
- Restart your editor
- Check if skills are installed: `npx skills list`

### Skills not installing?
- Check Node.js version (>= 20 required)
- Check network connection
- Try without `-y` flag to see prompts

### Outdated guidelines?
```bash
# Update all skills to latest versions
npx skills update

# Or reinstall individual skills
npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y
```

## Resources

- **Skills Directory**: https://skills.sh/
- **Skills Documentation**: https://skills.sh/docs
- **Vercel Labs Skills**: https://github.com/vercel-labs/agent-skills
- **Project README**: `/README.md`
- **UI Theme Docs**: `/packages/ui-theme/README.md`

## Contributing

When adding new patterns or guidelines:

1. Update `.clinerules` with new guidelines
2. Document in relevant README or docs
3. Test with AI assistants
4. Commit and share with team

---

**Last Updated**: February 10, 2026
**Maintained By**: Arrow Engineering Team
