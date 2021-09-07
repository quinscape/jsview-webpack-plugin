const fs = require("fs");
const path = require("path");

function endsWith(s, suffix)
{
    const pos = s.indexOf(suffix);
    return pos === s.length - suffix.length;
}

function endsWithOneOf(file, suffixes)
{
    for (let i = 0; i < suffixes.length; i++)
    {
        const suffix = suffixes[i];
        if (endsWith(file, suffix))
        {
            return true;
        }
    }
    return false;
}

/**
 * @module WebpackOnBuildPlugin
 */

function onBuildDone(stats)
{
    try
    {
        const buildDir = this.buildDir;
        const opts = this.opts;

        const data = stats.toJson();

        const assetsPath = path.resolve(buildDir, "webpack-assets.json");
        if (opts.debug)
        {
            console.log("Writing webpack assets to", assetsPath);
        }

        fs.writeFileSync(
            assetsPath,
            JSON.stringify(data.entrypoints, null, 4)
        );
    }
    catch (e)
    {
        console.error(e);
    }
}

const DEFAULT_OPTS = {

    /** if true, print report on deletion */
    debug: false
};

function WebpackAssetsPlugin(opts)
{
    this.opts = Object.assign({}, DEFAULT_OPTS, opts);
    this.onBuildDone = onBuildDone.bind(this);
}

WebpackAssetsPlugin.prototype.apply = function (compiler) {
    this.buildDir = compiler.options.output.path;

    compiler.hooks.done.tap("jsview-plugin", this.onBuildDone);
};

module.exports = WebpackAssetsPlugin;
