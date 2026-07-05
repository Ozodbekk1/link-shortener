Contributing to Link Shortener
Thank you for your interest in contributing to Link Shortener! We welcome contributions from developers of all skill levels. By participating in this project, you help build a faster, more reliable, and modern link management ecosystem.

This guide outlines our Turborepo development workflow, workspace architecture, coding standards, and expectations for submitting pull requests.

🏗️ Technical Stack & Architecture
Our project is organized as a high-performance Turborepo Monorepo managed with Yarn Workspaces. Before jumping in, please familiarize yourself with our project structure:

Monorepo Manager: Turborepo

Package Manager: Yarn Workspaces

Frontend Applications: Next.js (located in apps/web/)

Backend / API Applications: Node.js / Next.js API (located in apps/api/)

Shared UI Libraries: React + Tailwind CSS (located in packages/ui/)

Core Frameworks: React 19 & Next.js 15

Language: TypeScript (Strict Mode)

🚀 Getting Started
Prerequisites
Node.js: ^20.10.0 or higher

Package Manager: yarn (v1 or modern workspaces)

Git

Local Setup
Fork the Repository: Click the 'Fork' button at the top right of the GitHub page.

Clone your Fork:

Bash
git clone https://github.com/Ozodbekk1/link-shortener.git
Navigate and Install Dependencies:

Bash
cd link-shortener
yarn install
Set Up Environment Variables:
Copy the example environment files inside the applications and fill in your local credentials:

Bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local
Run the Development Server:
Launch the entire monorepo pipeline using Turborepo:

Bash
yarn dev
This will concurrently run your frontend (apps/web), backend (apps/api), and watch for changes in packages/ui.

🔄 Development Workflow
We follow a strict Feature Branch workflow using pull requests (PRs).

1. Branch Naming Convention
Create a branch from main using the following prefixes:

feat/ — For new features (e.g., feat/analytics-dashboard)

fix/ — For bug fixes (e.g., fix/expired-link-redirect)

docs/ — For documentation updates (e.g., docs/api-endpoints)

refactor/ — For code optimization without behavior changes

test/ — For adding missing tests

2. Commit Message Guidelines
We enforce Conventional Commits. Commit messages must be structured as follows:

Plaintext
<type>(<scope>): <short summary>

[optional body]
Examples:

feat(web): integrate custom domain mapping form

fix(api): resolve rate-limiting edge case for short URLs

refactor(ui): optimize bundle size for shared Button component

🎨 Architecture & Coding Standards
To maintain a scalable and clean codebase across our workspaces, please adhere to these design principles:

Monorepo & UI Component Split
Application Specific UI: Place components that are exclusively used by the web application inside apps/web/.

Shared Core UI: Reusable global design primitives (buttons, modals, inputs, layout elements) belong inside the packages/ui/ workspace. If you modify packages, Turborepo will automatically manage dependency caching across apps/web and apps/api.

Server Components First: In apps/web/, utilize React Server Components (RSC) by default. Use 'use client' strictly at the leaf nodes where interactivity (e.g., hooks, event listeners) is required.

Data Fetching & Mutations: Fetch data inline within Server Components using async/await. Handle secure data updates and form submissions via Next.js Server Actions backed by robust runtime schema validation (e.g., using zod).

TypeScript Best Practices
Avoid using any. Use strict, explicit typing or generic types if reusable.

Use interface for structural data shapes and object definitions. Use type for unions, intersections, and aliases.

🧪 Testing & Quality Control
Your code must maintain high code quality standards. Run these validation steps locally via Turborepo before pushing:

Linting & Formatting
We use ESLint and Prettier to enforce consistent code layouts across all workspaces.

Bash
yarn lint
yarn format
Type Checking
Ensure all workspaces compile error-free:

Bash
yarn typecheck
Running Tests
Every bug fix or new feature must be accompanied by robust automated tests.

Bash
yarn test
📥 Submitting a Pull Request
Ensure your local branch is rebased onto the latest main branch.

Verify that all workspaces build cleanly through Turborepo:

Bash
yarn build
Push changes to your GitHub fork:

Bash
git push origin feat/your-feature-name
Open a Pull Request from your repository fork against our main branch.

Fill out the Pull Request Template accurately detailing:

What changed?

Why was it changed?

How did you test it? (Include screenshots or screen recordings for UI modifications).

Wait for a maintainer review. Address any requested changes promptly.

Thank you for making Link Shortener better! 🚀
