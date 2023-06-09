const { defineConfig } = require("vite");
const { importMaps } = require("vite-plugin-import-maps");

module.exports = defineConfig({
  plugins: [
    importMaps([
      {
        imports: {
          three: "https://unpkg.com/three@0.151.0/build/three.module.js",
          "three/addons/": "https://unpkg.com/three@0.151.0/examples/jsm/",
          "mindar-image-three":
            "https://cdn.jsdelivr.net/npm/mind-ar@1.2.0/dist/mindar-image-three.prod.js",
        },
      },
    ]),
  ],
  build: {
    rollupOptions: {
      external: [
        "three",
        "three/addons/",
        "three/addons/libs/stats.module.js",
        "three/addons/loaders/GLTFLoader.js",
        "mindar-image-three",
      ],
    },
  },
});
