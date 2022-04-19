export const ROUTE_FORWARD_SLASH = "/";
export const ROUTE_SIGN_IN = "/sign_in";
export const ROUTE_PROFILE = "/profile";
export const ROUTE_TESTS = "/tests";
export const ROUTE_TEST = (testId?: number | string) => {
  if (testId) {
    return `/tests/${testId}`;
  } else {
    return "/tests/:id";
  }
};
export const ROUTE_DEBUG = "/debug";
