# Charger Finder Backend

This project is the backend service for the ChargeHub application. It provides APIs for user authentication, profile access, and basic server setup for the charger-finding platform.

## Branch Naming Rules

Branch names must start with one of these prefixes:

- feature
- bugfix
- hotfix
- release
- docs
- chore
- refactor
- test

Follow the prefix with a slash and a descriptive lowercase name.

Examples:

```bash
feature/login
bugfix/payment
hotfix/crash
```

## Project Folder Structure

```text
charger-finder/
├── config/                     # Database configuration
│   └── database.js            # Connects the app to MongoDB
├── middleware/                # Request protection logic
│   └── auth.js                # JWT authentication middleware
├── models/                    # Data models
│   └── user.js                # User schema and auth helpers
├── routes/                    # API endpoints
│   ├── auth.js                # Signup/login/logout/profile routes
│   └── index.js               # Main router entry point
├── utils/                     # Helper utilities
│   └── validation.js          # Input validation functions
├── Docs/                      # Project documentation files
├── Diagrams/                  # Architecture/flow diagrams
├── .github/                   # GitHub configuration
│   └── workflows/             # CI/CD workflow files
├── .husky/                    # Git hooks for Husky
│   └── pre-commit            # Runs linting and formatting checks before commit
├── eslint.config.js          # Linting rules
├── package.json               # Project dependencies, scripts, and Husky config
├── readme.md                  # Project documentation
└── server.js                  # Express server entry point
```
