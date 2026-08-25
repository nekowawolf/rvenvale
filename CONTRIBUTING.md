# Contributing to Rvenvale

First of all, thank you for considering contributing to Rvenvale! We welcome all contributions.

## Architecture Overview

### Solution Structure

```text
rvenvale/                               # Monorepo root directory
├── backend/                            # REST API server (Golang & Fiber)
│   ├── config/                         # MongoDB connection setup & ENV validation
│   ├── controllers/                    # HTTP request/response handlers
│   ├── middlewares/                    # Fiber middlewares (e.g., CORS)
│   ├── models/                         # Go structs for MongoDB schemas & API payloads
│   ├── module/                         # Database operations (Insert/Get/Delete)
│   ├── routes/                         # API endpoint definitions
│   └── utils/                          # Helper functions (GitHub API, WebP converter)
│
└── frontend/                           # UI Dashboard (Next.js & TailwindCSS)
    ├── public/                         # Static assets (images, icons)
    └── src/                            # Main frontend source code
        ├── app/                        # Next.js App Router (pages and layouts)
        ├── components/                 # Reusable UI components (UploadArea, etc.)
        ├── hooks/                      # Custom hooks for data fetching
        ├── services/                   # API client functions communicating with the backend
        ├── styles/                     # Global CSS (Tailwind directives, theme variables)
        └── types/                      # TypeScript interfaces and types
```

## Commit messages

We use [conventional commits](https://www.conventionalcommits.org/) to keep our commit history clean and readable. 

Please prefix your commits with one of the following labels:
- `feat`: new feature or attribute
- `fix`: bug fix
- `docs`: documentation only
- `chore`: build, tooling, version bumps