import installer from './defaults';
export * from '@lemon-peel/components';
export * from '@lemon-peel/constants';
export * from '@lemon-peel/directives';
export * from '@lemon-peel/hooks/src';
export * from '@lemon-peel/tokens';
export * from './makeInstaller';

export const install = installer.install;
export const version = installer.version;


export { default as dayjs } from 'dayjs';

export { default } from './defaults';