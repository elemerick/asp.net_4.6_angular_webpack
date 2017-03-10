const baseHref = undefined;
const deployUrl = undefined;

module.exports = {
  plugins: [
    require(`autoprefixer`),
    require(`postcss-url`)(
        {"url": (URL) => {
          // Only convert absolute URLs, which CSS-Loader won't process into require().
          if (!URL.startsWith(`/`)) {
            return URL;
          }
          // Join together base-href, deploy-url and the original URL.
          // Also dedupe multiple slashes into single ones.
          return `/${baseHref || ''}/${deployUrl || ''}/${URL}`.replace(/\/\/+/g, '/');
        }})
  ]
};
