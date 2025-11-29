#!/usr/bin/env node

/**
 * Deployment script for publishing npm package, CDN resources, and demo site
 *
 * Usage: npm run deploy
 *
 * This script will:
 * 1. Ask for release type (stable/rc/beta/alpha)
 * 2. Build all assets (npm, unpkg, demo)
 * 3. Generate CHANGELOG based on git commits
 * 4. Update version in package.json
 * 5. Publish to npm with appropriate tag
 * 6. Commit changes and create git tag
 * 7. Push to GitHub (triggers GitHub Actions for Pages deployment)
 * 8. Create PR and auto-merge to main (if on feature branch)
 *
 * Requirements:
 * - GitHub CLI (gh) for auto-merge: brew install gh
 */

import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import inquirer from 'inquirer'

// Colors for console output
const colors = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
}

function log(message, color = colors.reset) {
	console.log(`${color}${message}${colors.reset}`)
}

function exec(command, options = {}) {
	log(`\n> ${command}`, colors.blue)
	try {
		return execSync(command, {
			stdio: 'inherit',
			...options,
		})
	} catch (error) {
		log(`Error executing command: ${command}`, colors.red)
		throw error
	}
}

function execQuiet(command) {
	try {
		return execSync(command, { encoding: 'utf-8' }).trim()
	} catch {
		return ''
	}
}

function getCurrentVersion() {
	const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'))
	return packageJson.version
}

function bumpVersion(currentVersion, type, releaseType = 'stable') {
	// Remove any existing prerelease suffix
	const baseVersion = currentVersion.split('-')[0]
	const [major, minor, patch] = baseVersion.split('.').map(Number)

	let newVersion
	switch (type) {
		case 'major':
			newVersion = `${major + 1}.0.0`
			break
		case 'minor':
			newVersion = `${major}.${minor + 1}.0`
			break
		case 'patch':
			newVersion = `${major}.${minor}.${patch + 1}`
			break
		default:
			throw new Error(`Invalid version type: ${type}`)
	}

	// Add prerelease suffix if not stable
	if (releaseType !== 'stable') {
		const timestamp = Date.now()
		switch (releaseType) {
			case 'alpha':
				newVersion += `-alpha.${timestamp}`
				break
			case 'beta':
				newVersion += `-beta.${timestamp}`
				break
			case 'rc':
				newVersion += `-rc.${timestamp}`
				break
		}
	}

	return newVersion
}

function updatePackageVersion(newVersion) {
	const packagePath = resolve(process.cwd(), 'package.json')
	const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))
	packageJson.version = newVersion
	writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`)
}

function getCommitsSinceLastTag() {
	const lastTag = execQuiet('git describe --tags --abbrev=0 2>/dev/null')
	let commits

	if (lastTag) {
		commits = execQuiet(
			`git log ${lastTag}..HEAD --pretty=format:"%s|||%h|||%an|||%ad" --date=short`,
		)
	} else {
		commits = execQuiet('git log --pretty=format:"%s|||%h|||%an|||%ad" --date=short')
	}

	if (!commits) return []

	return commits.split('\n').map((line) => {
		const [message, hash, author, date] = line.split('|||')
		return { message, hash, author, date }
	})
}

function categorizeCommits(commits) {
	const categories = {
		breaking: [],
		feat: [],
		fix: [],
		perf: [],
		refactor: [],
		docs: [],
		style: [],
		test: [],
		build: [],
		ci: [],
		chore: [],
		other: [],
	}

	for (const commit of commits) {
		const message = commit.message.toLowerCase()

		if (message.includes('breaking change') || message.startsWith('breaking:')) {
			categories.breaking.push(commit)
		} else if (message.startsWith('feat:') || message.startsWith('feature:')) {
			categories.feat.push(commit)
		} else if (message.startsWith('fix:')) {
			categories.fix.push(commit)
		} else if (message.startsWith('perf:')) {
			categories.perf.push(commit)
		} else if (message.startsWith('refactor:')) {
			categories.refactor.push(commit)
		} else if (message.startsWith('docs:')) {
			categories.docs.push(commit)
		} else if (message.startsWith('style:')) {
			categories.style.push(commit)
		} else if (message.startsWith('test:')) {
			categories.test.push(commit)
		} else if (message.startsWith('build:')) {
			categories.build.push(commit)
		} else if (message.startsWith('ci:')) {
			categories.ci.push(commit)
		} else if (message.startsWith('chore:')) {
			categories.chore.push(commit)
		} else {
			categories.other.push(commit)
		}
	}

	return categories
}

function generateChangelogEntry(version, categories, _versionType) {
	const date = new Date().toISOString().split('T')[0]
	let entry = `## [${version}] - ${date}\n\n`

	const categoryLabels = {
		breaking: '### ⚠️ BREAKING CHANGES',
		feat: '### ✨ Features',
		fix: '### 🐛 Bug Fixes',
		perf: '### ⚡ Performance',
		refactor: '### ♻️ Refactor',
		docs: '### 📝 Documentation',
		style: '### 💄 Styles',
		test: '### ✅ Tests',
		build: '### 📦 Build',
		ci: '### 👷 CI',
		chore: '### 🔧 Chore',
		other: '### 📌 Other',
	}

	for (const [key, label] of Object.entries(categoryLabels)) {
		if (categories[key] && categories[key].length > 0) {
			entry += `${label}\n\n`
			for (const commit of categories[key]) {
				const message = commit.message.replace(
					/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|breaking):\s*/i,
					'',
				)
				entry += `- ${message} ([${commit.hash}](../../commit/${commit.hash}))\n`
			}
			entry += '\n'
		}
	}

	return entry
}

function updateChangelog(version, categories, versionType) {
	const changelogPath = resolve(process.cwd(), 'CHANGELOG.md')
	const newEntry = generateChangelogEntry(version, categories, versionType)

	let changelog = ''
	if (existsSync(changelogPath)) {
		changelog = readFileSync(changelogPath, 'utf-8')
	} else {
		changelog = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n\n`
	}

	// Find the position to insert the new entry (after the header, before the first version)
	const lines = changelog.split('\n')
	const insertIndex = lines.findIndex((line) => line.startsWith('## ['))

	if (insertIndex === -1) {
		// No existing versions, append to the end
		changelog += newEntry
	} else {
		// Insert before the first existing version
		lines.splice(insertIndex, 0, newEntry)
		changelog = lines.join('\n')
	}

	writeFileSync(changelogPath, changelog)
	log('\n✅ CHANGELOG.md updated', colors.green)
}

async function main() {
	try {
		log('\n🚀 Starting deployment process...', colors.bright)

		// Check if git working directory is clean
		const gitStatus = execQuiet('git status --porcelain')
		if (gitStatus) {
			log('\n⚠️  Warning: You have uncommitted changes:', colors.yellow)
			log(gitStatus, colors.yellow)

			const { continueAnyway } = await inquirer.prompt([
				{
					type: 'confirm',
					name: 'continueAnyway',
					message: 'Do you want to continue anyway?',
					default: false,
				},
			])

			if (!continueAnyway) {
				log('\n❌ Deployment cancelled.', colors.red)
				process.exit(1)
			}
		}

		// Get current version
		const currentVersion = getCurrentVersion()
		log(`\nCurrent version: ${currentVersion}`, colors.green)

		// Ask for release type (alpha/beta/rc/stable)
		const { releaseType } = await inquirer.prompt([
			{
				type: 'list',
				name: 'releaseType',
				message: 'Select release type:',
				choices: [
					{
						name: '🚀 Stable - Production ready release',
						value: 'stable',
					},
					{
						name: '🧪 Alpha - Early testing version (unstable)',
						value: 'alpha',
					},
					{
						name: '🔬 Beta - Testing version (feature complete)',
						value: 'beta',
					},
					{
						name: '✨ RC - Release Candidate (near production)',
						value: 'rc',
					},
				],
				default: 'stable',
			},
		])

		// Ask for version bump type
		const { versionType } = await inquirer.prompt([
			{
				type: 'list',
				name: 'versionType',
				message: 'Select version bump type:',
				choices: [
					{
						name: `patch (${bumpVersion(currentVersion, 'patch', releaseType)})`,
						value: 'patch',
					},
					{
						name: `minor (${bumpVersion(currentVersion, 'minor', releaseType)})`,
						value: 'minor',
					},
					{
						name: `major (${bumpVersion(currentVersion, 'major', releaseType)})`,
						value: 'major',
					},
				],
			},
		])

		const newVersion = bumpVersion(currentVersion, versionType, releaseType)

		// Show release type info
		const releaseTypeLabels = {
			stable: '🚀 Stable Release',
			alpha: '🧪 Alpha Version',
			beta: '🔬 Beta Version',
			rc: '✨ Release Candidate',
		}
		log(`\nRelease Type: ${releaseTypeLabels[releaseType]}`, colors.green)
		log(`New version will be: ${newVersion}`, colors.green)

		// Confirm deployment
		const { confirm } = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'confirm',
				message: `Are you sure you want to deploy version ${newVersion}?`,
				default: false,
			},
		])

		if (!confirm) {
			log('\n❌ Deployment cancelled.', colors.red)
			process.exit(0)
		}

		// Update version in package.json
		log('\n📝 Updating package.json...', colors.bright)
		updatePackageVersion(newVersion)

		// Build all assets BEFORE generating changelog
		log('\n🔨 Building all assets...', colors.bright)
		exec('npm run build')
		log('   Build completed successfully', colors.green)

		// Generate CHANGELOG
		log('\n📋 Generating CHANGELOG...', colors.bright)
		const commits = getCommitsSinceLastTag()
		if (commits.length > 0) {
			const categories = categorizeCommits(commits)
			updateChangelog(newVersion, categories, versionType)
			log(`   Found ${commits.length} commits since last release`, colors.green)
		} else {
			log('   No new commits found, skipping CHANGELOG update', colors.yellow)
		}

		// Publish to npm
		log('\n📦 Publishing to npm...', colors.bright)

		// Add npm tag based on release type
		let publishCommand = 'npm publish'
		if (releaseType !== 'stable') {
			publishCommand += ` --tag ${releaseType}`
			log(`   Publishing with tag: ${releaseType}`, colors.yellow)
		}
		exec(publishCommand)

		// Git operations
		log('\n📌 Committing changes and creating tag...', colors.bright)
		exec('git add .')
		exec(`git commit -m "chore: release v${newVersion}"`)
		exec(`git tag v${newVersion}`)

		// Get current branch
		const currentBranch = execQuiet('git rev-parse --abbrev-ref HEAD')
		log(`\nCurrent branch: ${currentBranch}`, colors.green)

		// Push changes and tags
		log('\n⬆️  Pushing to GitHub...', colors.bright)
		exec(`git push origin ${currentBranch}`)
		exec(`git push origin v${newVersion}`)

		log('\n✅ Tag pushed successfully!', colors.green)
		log(`   GitHub Actions will automatically deploy to GitHub Pages`, colors.blue)
		log(
			`   Monitor progress at: https://github.com/${execQuiet('git config --get remote.origin.url').replace(/.*[:/](.+\/.+?)(?:\.git)?$/, '$1')}/actions`,
			colors.blue,
		)

		// Create pull request and auto-merge (if not on main branch)
		if (currentBranch !== 'main' && currentBranch !== 'master') {
			log('\n🔀 Creating pull request...', colors.bright)

			// Check if gh CLI is available
			const ghInstalled = execQuiet('which gh')

			if (ghInstalled) {
				try {
					// Create PR with auto-merge flag
					const prUrl = execQuiet(
						`gh pr create --title "Release v${newVersion}" --body "🚀 Release version ${newVersion}\\n\\nThis PR was automatically created by the deploy script.\\n\\n## Changes\\n- Version bumped to ${newVersion}\\n- CHANGELOG updated\\n- Published to npm with tag: ${releaseType === 'stable' ? 'latest' : releaseType}" --base main --head ${currentBranch}`,
					)
					log('\n✅ Pull request created successfully!', colors.green)
					log(`   ${prUrl}`, colors.blue)

					// Auto-merge the PR
					log('\n🔀 Auto-merging pull request...', colors.bright)
					try {
						exec(`gh pr merge ${prUrl} --merge --delete-branch`)
						log('\n✅ Pull request merged and branch deleted!', colors.green)

						// Switch back to main and pull latest
						log('\n🔄 Switching to main branch...', colors.bright)
						exec('git checkout main')
						exec('git pull origin main')
						log('✅ Switched to main branch and synced!', colors.green)
					} catch (mergeError) {
						log('\n⚠️  Could not auto-merge pull request.', colors.yellow)
						log('Possible reasons:', colors.yellow)
						log('  - Branch protection rules require reviews', colors.yellow)
						log('  - Merge conflicts exist', colors.yellow)
						log(`  - Visit ${prUrl} to merge manually`, colors.yellow)
					}
				} catch (error) {
					log('\n⚠️  Could not create pull request automatically.', colors.yellow)
					log('Please create it manually on GitHub.', colors.yellow)
					log(`Branch: ${currentBranch} -> main`, colors.yellow)
				}
			} else {
				log('\n⚠️  GitHub CLI (gh) is not installed.', colors.yellow)
				log('Install it to enable auto-merge: brew install gh', colors.yellow)
				log('\nManual merge steps:', colors.yellow)
				log(`  1. git checkout main`, colors.yellow)
				log(`  2. git merge ${currentBranch}`, colors.yellow)
				log(`  3. git push origin main`, colors.yellow)
				log(`  4. git branch -d ${currentBranch}`, colors.yellow)
			}
		} else {
			log('\n✅ Already on main branch, no PR needed.', colors.green)
		}

		log('\n\n✨ Deployment completed successfully!', colors.green + colors.bright)
		log(`\nVersion: ${newVersion}`, colors.green)
		log(`Tag: v${newVersion}`, colors.green)
		log(`Release Type: ${releaseTypeLabels[releaseType]}`, colors.green)

		// Show installation instructions based on release type
		log('\n📦 Installation:', colors.bright)
		if (releaseType === 'stable') {
			log(`   npm install open-web-box`, colors.green)
		} else {
			log(`   npm install open-web-box@${releaseType}`, colors.yellow)
			log(`   or`, colors.yellow)
			log(`   npm install open-web-box@${newVersion}`, colors.yellow)
		}

		// Show available tags
		if (releaseType !== 'stable') {
			log('\n📌 npm tags:', colors.bright)
			log(`   latest - stable releases`, colors.green)
			log(`   ${releaseType} - ${releaseTypeLabels[releaseType]}`, colors.yellow)
		}

		log('\n🎉 Your package is now published!', colors.green)
	} catch (error) {
		log('\n\n❌ Deployment failed!', colors.red + colors.bright)
		log(error.message, colors.red)
		process.exit(1)
	}
}

main()
