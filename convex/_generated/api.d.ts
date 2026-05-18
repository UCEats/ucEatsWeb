/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as tables_acknowledgments from "../tables/acknowledgments.js";
import type * as tables_dates from "../tables/dates.js";
import type * as tables_feedback from "../tables/feedback.js";
import type * as tables_feedbackLikes from "../tables/feedbackLikes.js";
import type * as tables_files from "../tables/files.js";
import type * as tables_meals from "../tables/meals.js";
import type * as tables_notifications from "../tables/notifications.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "tables/acknowledgments": typeof tables_acknowledgments;
  "tables/dates": typeof tables_dates;
  "tables/feedback": typeof tables_feedback;
  "tables/feedbackLikes": typeof tables_feedbackLikes;
  "tables/files": typeof tables_files;
  "tables/meals": typeof tables_meals;
  "tables/notifications": typeof tables_notifications;
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
