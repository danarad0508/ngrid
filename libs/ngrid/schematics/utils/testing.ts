import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';

export function getFileContent(tree: Tree, path: string): string {
  const file = tree.read(path);
  if (!file) {
    throw new Error(`File not found: ${path}`);
  }
  return file.toString('utf-8');
}

function createWorkspace(runner: SchematicTestRunner): Promise<UnitTestTree> {
  return runner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', {
        name: 'workspace',
        version: '10.0.0',
        newProjectRoot: 'projects',
      })
      .toPromise();
}

/**
 * Creates a sample workspace with two applications: 'app' (default) and 'second-app'
 */
export async function createTestApp(runner: SchematicTestRunner, appOptions = {}): Promise<UnitTestTree> {
  let tree = await createWorkspace(runner);
  tree =
      await runner.runExternalSchematicAsync('@schematics/angular', 'application', {name: 'app', ...appOptions}, tree)
          .toPromise();

  return runner
      .runExternalSchematicAsync('@schematics/angular', 'application', {name: 'second-app', ...appOptions}, tree)
      .toPromise();
}
