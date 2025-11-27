import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default {
    tabWidth: 4,
    plugins: [require.resolve("prettier-plugin-tailwindcss")],
};
