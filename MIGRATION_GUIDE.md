# Repository Migration Guide

## Overview

This guide provides step-by-step instructions for migrating code from `arrow-ecommerce` (personal namespace) to `ecommerce-web` (organization repository) while preserving all branches and commit history.

## Prerequisites

- Git installed on your local machine
- Access to both repositories (read access to source, write access to destination)
- Backup of important data before starting

## Migration Steps

### Step 1: Backup and Preparation

```bash
# Clone both repositories locally
git clone <your-personal-arrow-ecommerce-url> arrow-ecommerce-backup
git clone <your-org-ecommerce-web-url> ecommerce-web-local

# Verify all branches from arrow-ecommerce
cd arrow-ecommerce-backup
git fetch --all
git branch -a
```

### Step 2: Clean Up Unwanted Files in ecommerce-web Main Branch

```bash
cd ecommerce-web-local
git checkout main

# Remove unwanted files (replace with your actual files/folders)
git rm <file1> <file2> <folder1> -r

# Commit the cleanup
git commit -m "Remove unnecessary files from main branch"
git push origin main
```

### Step 3: Add arrow-ecommerce as a Remote

```bash
# In ecommerce-web-local directory
git remote add arrow-ecommerce <your-personal-arrow-ecommerce-url>
git fetch arrow-ecommerce --tags
```

### Step 4: Migrate All Branches with History

```bash
# List all branches from arrow-ecommerce
git branch -r | grep 'arrow-ecommerce/' | grep -v 'HEAD' | sed 's/arrow-ecommerce\///'

# Migrate all branches using a loop
for branch in $(git branch -r | grep 'arrow-ecommerce/' | grep -v 'HEAD' | sed 's/arrow-ecommerce\///'); do
  echo "Migrating branch: $branch"
  git checkout -b "temp-$branch" "arrow-ecommerce/$branch"
  git push origin "temp-$branch:arrow-$branch"
  git branch -D "temp-$branch"
done
```

### Step 5: Merge arrow-ecommerce Content into Main

Choose one of the following options:

#### Option A: Replace ecommerce-web main with arrow-ecommerce main

```bash
git checkout main
git reset --hard arrow-ecommerce/main
git push origin main --force
```

⚠️ **Warning**: This will overwrite the current main branch. Ensure you have a backup.

#### Option B: Merge arrow-ecommerce main into ecommerce-web main

```bash
git checkout main
git merge arrow-ecommerce/main --allow-unrelated-histories
git push origin main
```

This preserves both histories and may require conflict resolution.

#### Option C: Keep arrow-ecommerce as separate branches

Branches are already pushed with `arrow-` prefix. Merge selectively as needed.

### Step 6: Clean Up and Verify

```bash
# Remove the arrow-ecommerce remote
git remote remove arrow-ecommerce

# Verify all branches are present
git fetch origin
git branch -a

# Check commit history is intact
git log --oneline --graph --all --decorate

# Verify specific branch history
git log arrow-main --oneline
```

### Step 7: Update Repository Settings

After migration, update:

- Default branch (if needed)
- Branch protection rules
- CI/CD pipeline configurations
- Webhooks and integrations
- Documentation references

### Step 8: Team Communication and Cleanup

1. **Notify team members** about the migration
2. **Update local clones**:
   ```bash
   git fetch --all --prune
   git pull origin main
   ```
3. **Archive or delete** the old `arrow-ecommerce` repository once verified

## Verification Checklist

- [ ] All branches migrated successfully
- [ ] Commit history preserved for all branches
- [ ] Tags migrated (if any)
- [ ] CI/CD pipelines working
- [ ] Team members notified
- [ ] Local clones updated
- [ ] Old repository archived/deleted

## Troubleshooting

### Issue: Unrelated histories error

```bash
git merge arrow-ecommerce/main --allow-unrelated-histories
```

### Issue: Large file or LFS objects

```bash
git lfs fetch arrow-ecommerce --all
git lfs push origin --all
```

### Issue: Branch already exists

```bash
# Delete existing branch and retry
git push origin --delete arrow-branch-name
# Then re-run migration for that branch
```

## Rollback Plan

If issues occur:

1. Keep `arrow-ecommerce-backup` directory intact
2. Force push from backup if needed:
   ```bash
   cd arrow-ecommerce-backup
   git push <ecommerce-web-url> main:main --force
   ```

## Important Notes

- **Backup first**: Keep the backup until 100% confident
- **Force push**: Only use when necessary and after team communication
- **Branch naming**: Migrated branches are prefixed with `arrow-` to avoid conflicts
- **Access control**: Verify permissions before starting
- **Large repositories**: May take time; be patient during fetch/push operations

## Support

For questions or issues during migration, contact the DevOps team or repository administrators.

---

**Migration Date**: [To be filled]
**Migrated By**: [To be filled]
**Status**: [Pending/In Progress/Completed]
