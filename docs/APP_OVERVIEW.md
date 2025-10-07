# T.A.I.L.S Mobile Application Overview

## Technology Stack
- **Framework:** The app is built with Expo Router on top of React Native, combining stack and tab navigators that mount the authentication flow and the protected tab group in a single layout. 【F:App/app/_layout.tsx†L1-L64】【F:App/app/(tabs)/_layout.tsx†L1-L132】
- **Language & Tooling:** TypeScript support is configured through Expo's base configuration with project-wide path aliases so screens can import modules via the `@/` prefix. 【F:App/tsconfig.json†L1-L19】
- **Backend Services:** Firebase provides authentication, analytics (web-only), and related helper APIs, exposing the `auth` instance along with email, phone, anonymous, and Google provider helpers. 【F:App/config/firebase.ts†L1-L65】

## Navigation Architecture
- **Root stack:** The root layout keeps the splash screen visible until initialization completes, wraps all screens with `AuthProvider`, and declares the login, signup, password reset, and social/phone auth modals alongside the tab navigator. 【F:App/app/_layout.tsx†L10-L64】
- **Route protection:** `PrivateRoute` checks the `AuthContext` before rendering the stack; while auth state loads it shows a themed loading view, and if the user is unauthenticated it redirects to `/loginPage`. 【F:App/components/PrivateRoute.tsx†L1-L96】
- **Tab system:** Once authenticated, users land in a six-tab layout (Home, Explore, Map, Dashboard, History, Settings) with custom haptic tab buttons and adaptive styling per platform. 【F:App/app/(tabs)/_layout.tsx†L12-L132】

## Authentication Flow
- **Context provider:** `AuthProvider` listens for Firebase auth state changes, mirrors user data into AsyncStorage for persistence, and exposes helpers for email/password sign-up & login, Google OAuth via Expo Auth Session, phone verification, anonymous sign-in, password reset, and logout while tracking loading/error state. 【F:App/contexts/AuthContext.tsx†L1-L370】
- **Firebase bootstrap:** The Firebase module initializes the app, conditionally enables analytics on web, and exports the auth functions consumed across the app. 【F:App/config/firebase.ts†L1-L65】

## Feature Modules
- **Home dashboard:** The home tab greets the authenticated pilot, displays mocked weather and flight statistics, and offers quick navigation shortcuts plus a notifications feed within a stylized satellite background. 【F:App/app/(tabs)/index.tsx†L1-L199】
- **Mapping tools:** The map tab wraps a platform-specific `react-native-maps` experience that lets users configure polygons, drop custom markers, and review their coordinates through interactive inputs. 【F:App/app/(tabs)/map.tsx†L1-L33】【F:App/components/Map/Map.native.tsx†L1-L253】
- **Settings & utilities:** The settings screen (not shown here) and other experiences reuse the animated backgrounds and circle patterns provided by shared UI utilities.

## Visual Foundations
- **Animated surfaces:** `AnimatedBackground` layers imagery, gradients, subtle motion, and optional circle patterns to give screens depth, while `TechBackground` builds tech-themed animated grids and circuit lines used during loading states. 【F:App/components/ui/AnimatedBackground.tsx†L1-L189】【F:App/components/ui/TechBackground.tsx†L1-L199】

## Data Persistence & Platform Notes
- Authentication state is cached in AsyncStorage for native platforms and synchronized with Firebase listeners so protected routes remain aware of the user's status across reloads. 【F:App/contexts/AuthContext.tsx†L89-L139】
- The map module leans on `react-native-maps`, so the native app requires the corresponding platform dependencies, while the project’s multi-file map component leaves room for a web-specific implementation when needed. 【F:App/components/Map/Map.native.tsx†L1-L253】
