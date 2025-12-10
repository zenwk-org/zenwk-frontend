/**
 * Reemplaza imports con alias @auth y @user por rutas relativas reales.
 * Puedes extender el script si deseas más alias.
 */

const path = require("path");

module.exports = function transformer(file, api) {
    const j = api.jscodeshift;
    const root = j(file.source);

    const aliasMap = {
        "@auth/": "@app/app/(modules)/(auth)/",
        "@user/": "@app/app/(modules)/user/",
    };

    root.find(j.ImportDeclaration).forEach((p) => {
        let value = p.value.source.value;

        for (const alias of Object.keys(aliasMap)) {
            if (value.startsWith(alias)) {
                const newPath = path
                    .relative(
                        path.dirname(file.path),
                        path.join(
                            process.cwd(),
                            aliasMap[alias],
                            value.replace(alias, "")
                        )
                    )
                    .replace(/\\/g, "/");

                p.value.source.value = newPath.startsWith(".")
                    ? newPath
                    : "./" + newPath;
            }
        }
    });

    return root.toSource();
};
