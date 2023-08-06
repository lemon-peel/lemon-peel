/* eslint-disable @typescript-eslint/no-use-before-define */
import process from 'node:process';
import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import consola from 'consola';
import * as vueCompiler from 'vue/compiler-sfc';
import glob from 'fast-glob';
import chalk from 'chalk';
import { Project } from 'ts-morph';
import { buildOutput, withDefaultExclude, pkgDir, projDir, mainDir } from '@lemon-peel/build-utils';
import { pathRewriter } from '../utils';
import type { CompilerOptions, SourceFile } from 'ts-morph';

const TSCONFIG_PATH = path.resolve(projDir, 'tsconfig.web.json');
const outDir = path.resolve(buildOutput, 'types');

/**
 * fork = require( https://github.com/egoist/vue-dts-gen/blob/main/src/index.ts
 */
export const generateTypesDefinitions = async () => {
  const compilerOptions: CompilerOptions = {
    composite: true,
    emitDeclarationOnly: true,
    outDir,
    baseUrl: projDir,
    preserveSymlinks: true,
    skipLibCheck: true,
    noImplicitAny: false,
    resolveJsonModule: true,
  };

  const project = new Project({
    compilerOptions,
    tsConfigFilePath: TSCONFIG_PATH,
    skipAddingFilesFromTsConfig: true,
  });

  const sourceFiles = await addSourceFiles(project);
  consola.success('Added source files');

  typeCheck(project);
  consola.success('Type check passed!');

  await project.emit({
    emitOnlyDtsFiles: true,
  });

  const tasks = sourceFiles.map(async sourceFile => {
    const relativePath = path.relative(pkgDir, sourceFile.getFilePath());
    consola.trace(
      chalk.yellow(
        `Generating definition for file: ${chalk.bold(relativePath)}`,
      ),
    );

    const emitOutput = sourceFile.getEmitOutput();
    const emitFiles = emitOutput.getOutputFiles();
    if (emitFiles.length === 0) {
      throw new Error(`Emit no file: ${chalk.bold(relativePath)}`);
    }

    const subTasks = emitFiles.map(async outputFile => {
      const filepath = outputFile.getFilePath();
      await mkdir(path.dirname(filepath), {
        recursive: true,
      });

      await writeFile(
        filepath,
        pathRewriter('esm')(outputFile.getText()),
        'utf8',
      );

      consola.success(
        chalk.green(
          `Definition for file: ${chalk.bold(relativePath)} generated`,
        ),
      );
    });

    await Promise.all(subTasks);
  });

  await Promise.all(tasks);
};

async function addSourceFiles(project: Project) {
  project.addSourceFileAtPath(path.resolve(projDir, 'types/env.d.ts'));

  const globSourceFile = '**/*.{js?(x),ts?(x),vue}';
  const filePaths = withDefaultExclude(
    await glob([globSourceFile, '!main/**/*'], {
      cwd: pkgDir,
      absolute: true,
      onlyFiles: true,
    }),
  );

  const mainPaths = withDefaultExclude(
    await glob(globSourceFile, {
      cwd: mainDir,
      onlyFiles: true,
    }),
  );

  const sourceFiles: SourceFile[] = [];
  await Promise.all([
    ...filePaths.slice(3, 4).map(async file => {
      if (file.endsWith('.vue')) {
        const content = await readFile(file, 'utf8');
        const hasTsNoCheck = content.includes('@ts-nocheck');

        const sfc = vueCompiler.parse(content);
        const { script, scriptSetup } = sfc.descriptor;
        if (script || scriptSetup) {
          let content =
            (hasTsNoCheck ? '// @ts-nocheck\n' : '') + (script?.content ?? '');

          if (scriptSetup) {
            const compiled = vueCompiler.compileScript(sfc.descriptor, {
              id: 'xxx',
            });
            content += compiled.content;
          }

          const lang = scriptSetup?.lang || script?.lang || 'js';
          const sourceFile = project.createSourceFile(
            `${path.relative(process.cwd(), file)}.${lang}`,
            content,
          );
          sourceFiles.push(sourceFile);
        }
      } else {
        const sourceFile = project.addSourceFileAtPath(file);
        sourceFiles.push(sourceFile);
      }
    }),

    ...mainPaths.slice(0, 0).map(async file => {
      const content = await readFile(path.resolve(mainDir, file), 'utf8');
      sourceFiles.push(
        project.createSourceFile(path.resolve(pkgDir, file), content),
      );
    }),
  ]);

  return sourceFiles;
}

function typeCheck(project: Project) {
  const diagnostics = project.getPreEmitDiagnostics();
  if (diagnostics.length > 0) {
    consola.error(project.formatDiagnosticsWithColorAndContext(diagnostics));
    const err = new Error('Failed to generate dts.');
    consola.error(err);
    throw err;
  }
}

