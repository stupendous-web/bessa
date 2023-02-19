/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: "https://bessssssa.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    "/reset-password",
    "/app",
    "/app/edit-profile",
    "/app/members",
    "/app/messages",
    "/app/notifications",
    "/app/posts",
    "/app/settings",
  ],
};
