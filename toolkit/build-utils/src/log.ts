import process from 'process';
import consola from 'consola';

export function errorAndExit(err: Error): void {
  consola.error(err);
  process.exit(1);
}
