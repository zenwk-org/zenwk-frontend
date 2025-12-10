export default function transformer(file, api) {
    const j = api.jscodeshift;
    const root = j(file.source);

    root.find(j.ImportDeclaration).forEach((path) => {
        const value = path.node.source.value;

        if (typeof value !== "string") return;

        if (value.startsWith("@auth/")) {
            path.node.source.value = value.replace(
                "@auth/",
                "@app/app/(modules)/(auth)/"
            );
        }

        if (value.startsWith("@user/")) {
            path.node.source.value = value.replace(
                "@user/",
                "@app/app/(modules)/user/"
            );
        }
    });

    return root.toSource({ quote: "single" });
}
