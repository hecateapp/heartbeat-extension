const plugins = [];

const CopyWebpackPlugin = require('copy-webpack-plugin');
plugins.push(new CopyWebpackPlugin([{
    from: 'public/**/*',
    flatten: true,
}]));

// Live reloading in dev
if (process.env.NODE_ENV !== "production") {
    const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');
    plugins.push(new ChromeExtensionReloader({
        port: 9090, // Which port use to create the server
        entries: { //The entries used for the content/background scripts
            contentScript: ['popup', 'github', 'options'], //Use the entry names, not the file name or the path
            background: 'background'
        }
    }));
}

// Dynamically construct host whitelists for the manifest
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const path = require('path');

const manifestTemplate = require(path.join(__dirname, '.', 'manifest.json'));
if (process.env.NODE_ENV === "production") {
    manifestTemplate.permissions.push("https://*.hecate.co/");
} else {
    manifestTemplate.permissions.push("http://localhost:4567/");
}

plugins.push(new GenerateJsonPlugin('manifest.json', manifestTemplate));

module.exports = {
    entry: {
        popup: "./src/popup.tsx",
        background: "./src/background.ts",
        github: "./src/github.tsx",
        options: "./src/options.tsx"
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/dist"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    plugins: plugins,
};