# Requirements Document

## Introduction

This document specifies the requirements for fixing the session persistence issue where users are logged out when refreshing the mypage. The system currently uses a cookie-based authentication mechanism with HttpOnly cookies for refresh tokens and in-memory access tokens, but the session recovery mechanism fails on page refresh.

## Glossary

- **AuthStore**: Zustand store managing authentication state including user data and tokens
- **HttpClient**: Axios-based HTTP client with authentication interceptors
- **ProtectedRoute**: Route guard component that checks authentication before rendering protected pages
- **Session Recovery**: Process of restoring user authentication state after page refresh using HttpOnly cookies
- **ACCESS_TOKEN**: HttpOnly cookie containing the JWT access token
- **REFRESH_TOKEN**: HttpOnly cookie containing the JWT refresh token
- **fetchSession**: Function that calls `/users/me` endpoint to restore user session

## Requirements

### Requirement 1

**User Story:** As a logged-in user, I want my session to persist when I refresh the page, so that I don't have to log in again.

#### Acceptance Criteria

1. WHEN a user refreshes any page THEN the System SHALL restore the user session from HttpOnly cookies
2. WHEN the session recovery succeeds THEN the System SHALL populate the user state in AuthStore
3. WHEN the session recovery fails THEN the System SHALL clear authentication state and redirect to login
4. WHEN the user is on a protected route THEN the System SHALL wait for session recovery before rendering content
5. WHEN session recovery completes THEN the System SHALL set the hydration flag to true

### Requirement 2

**User Story:** As a developer, I want proper error handling during session recovery, so that users see appropriate feedback when authentication fails.

#### Acceptance Criteria

1. WHEN the `/users/me` endpoint returns an error THEN the System SHALL log the error details
2. WHEN session recovery fails due to network issues THEN the System SHALL display a network error message
3. WHEN session recovery fails due to expired tokens THEN the System SHALL clear auth state silently
4. WHEN the refresh token is invalid THEN the System SHALL redirect to login page
5. WHEN multiple session recovery attempts occur simultaneously THEN the System SHALL deduplicate requests

### Requirement 3

**User Story:** As a user, I want the loading state to be handled properly during session recovery, so that I don't see flickering or incorrect content.

#### Acceptance Criteria

1. WHEN session recovery is in progress THEN the System SHALL display a loading indicator
2. WHEN the hydration flag is false THEN the ProtectedRoute SHALL not render protected content
3. WHEN session recovery completes THEN the System SHALL remove the loading indicator
4. WHEN the user navigates between protected routes THEN the System SHALL not trigger redundant session recovery
5. WHEN the AuthStore rehydrates from localStorage THEN the System SHALL trigger session recovery automatically
