import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';

export default {
  plugins: [
    react(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
};
