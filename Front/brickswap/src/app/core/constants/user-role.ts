export enum UserRole {
  USER = 1,
  MODERATOR = 2,
  ADMIN = 3,
}

export const AUTHENTICATED_USER_ROLES = [
  UserRole.USER,
  UserRole.MODERATOR,
  UserRole.ADMIN,
] as const;

export const APP_ROUTE_PATHS = {
  home: 'home',
  catalog: 'catalog',
  categories: 'categories',
  articleDetail: 'article/:id',
  sellArticle: 'sell-article',
  login: 'login',
  register: 'register',
  myPanel: 'my-panel',
  messages: 'messages',
  profile: 'profile',
  moderator: 'moderador',
  administration: 'administration',
  administrationUsers: 'administration/users',
  administrationCategories: 'administration/categories',
  administrationModerator: 'administration/moderador',
} as const;

export const APP_NAVIGATION_PATHS = {
  home: `/${APP_ROUTE_PATHS.home}`,
  catalog: `/${APP_ROUTE_PATHS.catalog}`,
  categories: `/${APP_ROUTE_PATHS.categories}`,
  sellArticle: `/${APP_ROUTE_PATHS.sellArticle}`,
  login: `/${APP_ROUTE_PATHS.login}`,
  myPanel: `/${APP_ROUTE_PATHS.myPanel}`,
  messages: `/${APP_ROUTE_PATHS.messages}`,
  profile: `/${APP_ROUTE_PATHS.profile}`,
  moderator: `/${APP_ROUTE_PATHS.moderator}`,
  administration: `/${APP_ROUTE_PATHS.administration}`,
  administrationUsers: `/${APP_ROUTE_PATHS.administrationUsers}`,
  administrationCategories: `/${APP_ROUTE_PATHS.administrationCategories}`,
  administrationModerator: `/${APP_ROUTE_PATHS.administrationModerator}`,
} as const;
