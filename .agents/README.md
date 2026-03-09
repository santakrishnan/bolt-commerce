# Agent Skills

This directory contains agent skills that enhance AI-assisted development in VSCode.

## What Are Agent Skills?

Agent skills are domain-specific guidelines that AI agents (like GitHub Copilot) use to provide context-aware assistance. They contain best practices, patterns, and conventions for specific frameworks or domains.

## Included Skills

- **vercel-react-best-practices** - React/Next.js performance patterns
- **next-best-practices** - Next.js framework conventions
- **vercel-composition-patterns** - Component architecture
- **web-design-guidelines** - Accessibility & UX
- **find-skills** - Discover more skills

## How They Work

VSCode GitHub Copilot automatically discovers skills in:
1. `~/.agents/skills/` (global, per-user)
2. `.agents/skills/` (local, per-project) ✅ **This repo**

Skills in this directory are **committed to version control** so the entire team benefits without manual installation.

## For New Team Members

**No setup required!** Just clone and open the repo in VSCode with GitHub Copilot enabled.

The agent will automatically use these skills when:
- Reviewing code (e.g., "review this component")
- Writing new features (e.g., "add error handling")
- Refactoring (e.g., "improve performance")

## Updating Skills

To update skills from upstream:

```bash
# Update all skills
cd .agents/skills
for skill in */; do
  cd "$skill"
  git pull
  cd ..
done
```

Or reinstall globally and re-copy:

```bash
npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y
npx skills add vercel-labs/next-skills@next-best-practices -g -y
npx skills add vercel-labs/agent-skills@vercel-composition-patterns -g -y
npx skills add vercel-labs/agent-skills@web-design-guidelines -g -y
npx skills add vercel-labs/skills@find-skills -g -y

# Copy to project
cp -r ~/.agents/skills/* .agents/skills/
```

## Resources

- [Skills Documentation](https://skills.sh)
- [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills)
- [Next.js Skills](https://github.com/vercel-labs/next-skills)
