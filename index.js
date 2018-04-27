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
        const suffixes = opts.clean;

        if (suffixes && suffixes.length)
        {
            const newlyCreatedAssets = stats.compilation.assets;

            const unlinked = [];
            fs.readdir(path.resolve(buildDir), (err, files) => {

                if (err)
                {
                    throw err;
                }

                files.forEach(file => {

                    if (endsWithOneOf(file, suffixes) && !newlyCreatedAssets[file])
                    {
                        fs.unlinkSync(path.resolve(buildDir, file));
                        unlinked.push(file);
                    }
                });

                if (opts.debug && unlinked.length > 0)
                {
                    console.log("Removed old assets: ", unlinked);
                }
            });
        }

        if (opts.generateAssetsJson)
        {
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
    }
    catch (e)
    {
        console.error(e);
    }
}

const DEFAULT_OPTS = {

    generateAssetsJson: true,

    /** file name endings to clean.*/
    clean: [".js", ".js.map", ".css", ".css.map"],

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

    compiler.plugin("done", this.onBuildDone);
};

module.exports = WebpackAssetsPlugin;
