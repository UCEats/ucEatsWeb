/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as tables_admins from "../tables/admins.js";
import type * as tables_auth from "../tables/auth.js";
import type * as tables_dates from "../tables/dates.js";
import type * as tables_feedback from "../tables/feedback.js";
import type * as tables_files from "../tables/files.js";
import type * as tables_meals from "../tables/meals.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "tables/admins": typeof tables_admins;
  "tables/auth": typeof tables_auth;
  "tables/dates": typeof tables_dates;
  "tables/feedback": typeof tables_feedback;
  "tables/files": typeof tables_files;
  "tables/meals": typeof tables_meals;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
