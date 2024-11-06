// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ProcessEnv {
    //Application
    NODE_ENV: 'development' | 'production';
    PORT: number;
    //Database
    DB_PORT: string;
    DB_HOST: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    //JWT
    JWT_SECRET: string;
    JWT_EXPIRE: string;
    JWT_COOKIE_EXPIRE: string;
  }
}
