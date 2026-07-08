/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = "ai-apply-assistant";

const nextConfig = {
  output: isGitHubPages ? "export" : undefined,
  trailingSlash: isGitHubPages ? true : undefined,
  basePath: isGitHubPages ? `/${repositoryName}` : undefined,
  assetPrefix: isGitHubPages ? `/${repositoryName}/` : undefined,
};

export default nextConfig;
