# Implementation Plan

- [x] 1. Fix authStore session recovery logic

  - [x] 1.1 Improve fetchSession error handling and logging


    - Add detailed error logging for debugging session recovery failures
    - Ensure `_hydrated` is always set to true after fetchSession completes (success or failure)
    - Add try-catch-finally block to guarantee `_hydrated` is set
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3_
  
  - [x] 1.2 Fix onRehydrateStorage callback

    - Ensure fetchSession is called after Zustand rehydration
    - Handle case where state might be null during rehydration
    - _Requirements: 1.5, 3.5_
  
  - [x] 1.3 Add session recovery deduplication

    - Implement flag to prevent multiple simultaneous fetchSession calls
    - Track if fetchSession is already in progress
    - _Requirements: 2.5, 3.4_

- [x] 2. Verify and fix httpClient configuration

  - [x] 2.1 Verify withCredentials is properly set


    - Confirm `withCredentials: true` is set in axios config
    - Verify cookies are being sent with requests
    - _Requirements: 1.1_
  
  - [x] 2.2 Fix Authorization header logic

    - Ensure Authorization header is only added when accessToken exists in memory
    - Allow requests to work with cookies alone when accessToken is null
    - _Requirements: 1.1_
  
  - [x] 2.3 Improve error handling in response interceptor


    - Add specific handling for session recovery failures
    - Improve error messages for different failure scenarios
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3. Fix ProtectedRoute component

  - [x] 3.1 Ensure proper loading state handling


    - Wait for `_hydrated` to be true before making routing decisions
    - Display loading indicator while `_hydrated` is false
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 3.2 Improve loading fallback UI


    - Create a better loading indicator component
    - Add timeout handling for stuck loading states
    - _Requirements: 3.1, 3.3_

- [x] 4. Remove redundant session recovery calls

  - [x] 4.1 Clean up useMyPage hook


    - Remove redundant fetchSession call in useEffect
    - Rely on authStore's automatic session recovery
    - Only fetch user data if needed for specific page logic
    - _Requirements: 3.4_

- [x] 5. Add comprehensive error logging

  - [x] 5.1 Add debug logging to authStore

    - Log session recovery attempts
    - Log success/failure with details
    - Log hydration state changes
    - _Requirements: 2.1_
  
  - [x] 5.2 Add debug logging to httpClient

    - Log cookie presence in requests
    - Log Authorization header presence
    - Log token refresh attempts
    - _Requirements: 2.1_

- [x] 6. Checkpoint - Ensure all changes work correctly



  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Add unit tests for authStore
  - [ ] 7.1 Test fetchSession success path
    - Mock successful /users/me response
    - Verify user state is populated
    - Verify `_hydrated` is set to true
    - _Requirements: 1.1, 1.2_
  
  - [ ] 7.2 Test fetchSession failure paths
    - Test 401 error handling
    - Test network error handling
    - Test 500 error handling
    - Verify auth state is cleared
    - Verify `_hydrated` is set to true
    - _Requirements: 1.3, 2.2, 2.3_
  
  - [ ] 7.3 Test clearAuth functionality
    - Verify all state is cleared
    - Verify localStorage is cleared
    - _Requirements: 1.3_
  
  - [ ] 7.4 Test logout functionality
    - Mock logout API call
    - Verify auth state is cleared
    - Verify passwords are purged
    - _Requirements: 1.3_

- [ ] 8. Add unit tests for httpClient
  - [ ] 8.1 Test withCredentials configuration
    - Verify withCredentials is true
    - Verify cookies are sent with requests
    - _Requirements: 1.1_
  
  - [ ] 8.2 Test Authorization header logic
    - Test header is added when accessToken exists
    - Test header is not added when accessToken is null
    - Test skipAuth flag prevents header addition
    - _Requirements: 1.1_
  
  - [ ] 8.3 Test token refresh flow
    - Test 401 triggers refresh
    - Test successful refresh updates accessToken
    - Test failed refresh clears auth
    - Test request queuing during refresh
    - _Requirements: 2.4_

- [ ] 9. Add unit tests for ProtectedRoute
  - [ ] 9.1 Test loading state
    - Test renders loading when `_hydrated` is false
    - Test does not redirect when `_hydrated` is false
    - _Requirements: 3.1, 3.2_
  
  - [ ] 9.2 Test authentication check
    - Test redirects to login when `_hydrated` is true and user is null
    - Test renders element when `_hydrated` is true and user exists
    - _Requirements: 3.2_

- [ ] 10. Add property-based tests
  - [ ] 10.1 Property test for session recovery preservation
    - **Property 1: Session recovery preserves authentication state**
    - **Validates: Requirements 1.1, 1.2**
    - Generate random valid user objects
    - Mock /users/me to return the user
    - Call fetchSession()
    - Assert user state is populated and `_hydrated` is true
  
  - [ ] 10.2 Property test for failed session recovery
    - **Property 2: Failed session recovery clears state**
    - **Validates: Requirements 1.3, 2.3**
    - Generate random error responses (401, 403, 500, network error)
    - Mock /users/me to return the error
    - Call fetchSession()
    - Assert user state is null and `_hydrated` is true
  
  - [ ] 10.3 Property test for loading state
    - **Property 3: Loading state prevents premature rendering**
    - **Validates: Requirements 3.1, 3.2**
    - Generate random `_hydrated` and `user` combinations
    - Render ProtectedRoute with different states
    - Assert correct rendering based on state
  
  - [ ] 10.4 Property test for idempotent session recovery
    - **Property 4: Session recovery is idempotent**
    - **Validates: Requirements 3.4**
    - Generate random sequences of navigation events
    - Track fetchSession call count
    - Assert fetchSession is called only once when session exists

- [ ] 11. Add integration tests
  - [ ] 11.1 Test full authentication flow
    - Login → Navigate to mypage → Refresh page → Verify still logged in
    - Login → Navigate to mypage → Clear cookies → Refresh → Verify redirected to login
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [ ] 11.2 Test token refresh flow
    - Login → Wait for token expiry → Make API call → Verify token refreshed → Verify request succeeds
    - _Requirements: 2.4_
  
  - [ ] 11.3 Test error recovery flow
    - Login → Simulate network error → Verify error handling → Restore network → Verify recovery
    - _Requirements: 2.2_

- [ ] 12. Final checkpoint - Verify all functionality
  - Ensure all tests pass, ask the user if questions arise.
