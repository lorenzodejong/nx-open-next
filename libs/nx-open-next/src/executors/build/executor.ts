import {
  ExecutorContext,
  parseTargetString,
  readTargetOptions,
} from '@nx/devkit';
import { NextBuildBuilderOptions } from '@nx/next';

import { OpenNextBuildExecutorSchema } from './schema';
import { runCommandProcess } from '../../utils/command';

export default async function openNextBuildExecutor(
  options: OpenNextBuildExecutorSchema,
  context: ExecutorContext
) {
  if (!context.projectGraph) {
    throw new Error('Cannot find project graph');
  }

  try {
    const targetString = parseTargetString(
      options.buildTarget,
      context.projectGraph
    );
    const buildOptions = readTargetOptions<NextBuildBuilderOptions>(
      targetString,
      context
    );

    // The Next.js build is usually executed by Nx from the dependsOn in the project.json
    const buildCommand = options.buildCommand || 'exit 0';
    const openNextBuildCommand = `open-next build --build-command "${buildCommand}" --build-output-path "${buildOptions.outputPath}" --app-path "${options.sourceRoot}"`;

    const success = await runCommandProcess(openNextBuildCommand, context.root);

    return {
      success,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
    };
  }
}
