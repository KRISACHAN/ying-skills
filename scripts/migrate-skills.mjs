import { checkbox, confirm, input, select } from '@inquirer/prompts';
import { access, copyFile, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import {
  TOOL_LAYOUTS,
  generateSkillGroup,
  generatedToolRoot,
  listSkillGroups,
  normalizeTools,
} from './generate-skills.mjs';

async function isDirectory(target) {
  try {
    return (await stat(target)).isDirectory();
  } catch {
    return false;
  }
}

function parseArgs(argv) {
  const options = { tools: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--path' || arg === '-p') options.projectPath = argv[++index];
    else if (arg === '--group' || arg === '-g') options.group = argv[++index];
    else if (arg === '--tool' || arg === '-t') options.tools.push(argv[++index]);
    else if (arg === '--yes' || arg === '-y') options.yes = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function printHelp() {
  console.log(`Usage: pnpm migrate -- [options]\n\nInteractive mode is used for any omitted option.\n\nOptions:\n  -p, --path <path>    Target project path\n  -g, --group <name>   Skill group to migrate\n  -t, --tool <name>    AI tool format (repeatable, or all)\n  -y, --yes            Overwrite colliding skill files without confirmation\n  -h, --help           Show this help\n\nSupported tools: ${Object.keys(TOOL_LAYOUTS).join(', ')}, all`);
}

async function walkFiles(root, relative = '') {
  const current = path.join(root, relative);
  const entries = await readdir(current, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const next = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...(await walkFiles(root, next)));
    else if (entry.isFile()) files.push(next);
  }
  return files;
}

async function existingCollisions(sourceRoot, targetRoot) {
  const files = await walkFiles(sourceRoot);
  const collisions = [];
  for (const file of files) {
    try {
      await access(path.join(targetRoot, file));
      collisions.push(file);
    } catch {
      // No collision.
    }
  }
  return collisions;
}

async function mergeDirectory(sourceRoot, targetRoot) {
  const entries = await readdir(sourceRoot, { withFileTypes: true });
  await mkdir(targetRoot, { recursive: true });
  for (const entry of entries) {
    const source = path.join(sourceRoot, entry.name);
    const target = path.join(targetRoot, entry.name);
    if (entry.isDirectory()) await mergeDirectory(source, target);
    else if (entry.isFile()) {
      await mkdir(path.dirname(target), { recursive: true });
      await copyFile(source, target);
    }
  }
}

function expandHome(value) {
  if (!value.startsWith('~')) return value;
  const home = process.env.HOME || process.env.USERPROFILE;
  if (!home) throw new Error('Cannot expand ~ because HOME/USERPROFILE is unavailable.');
  return path.join(home, value.slice(1));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) return printHelp();

  console.log('Ying Skills Migration');
  console.log(
    'Merges generated skill files into an existing project. Existing unrelated files are preserved.',
  );

  let projectPath =
    options.projectPath ?? (await input({ message: 'Project path', required: true })).trim();
  if (!projectPath) throw new Error('Project path is required.');
  projectPath = path.resolve(expandHome(projectPath));
  if (!(await isDirectory(projectPath))) {
    throw new Error(`Project directory does not exist: ${projectPath}`);
  }

  const groups = await listSkillGroups();
  if (groups.length === 0) throw new Error('No skill groups found.');

  let group = options.group;
  if (group) {
    if (!groups.includes(group)) throw new Error(`Unknown skill group: ${group}`);
  } else {
    group = await select({
      message: 'Skill group',
      choices: groups.map((name) => ({ name, value: name })),
    });
  }

  let tools;
  if (options.tools.length) {
    tools = normalizeTools(options.tools);
  } else {
    const toolItems = Object.entries(TOOL_LAYOUTS).map(([value, config], index) => ({
      name: `${config.label} (${config.root}/skills)`,
      value,
      checked: index === 0,
    }));
    tools = await checkbox({
      message: 'AI tool format',
      choices: toolItems,
      required: true,
    });
  }

  await generateSkillGroup(group, tools);

  const allCollisions = [];
  for (const tool of tools) {
    const collisions = await existingCollisions(generatedToolRoot(group, tool), projectPath);
    allCollisions.push(...collisions.map((file) => `[${tool}] ${file}`));
  }

  if (allCollisions.length) {
    console.log(`\n${allCollisions.length} existing file(s) will be updated:`);
    allCollisions.slice(0, 20).forEach((file) => console.log(`  - ${file}`));
    if (allCollisions.length > 20) {
      console.log(`  ... and ${allCollisions.length - 20} more`);
    }

    if (!options.yes) {
      const shouldOverwrite = await confirm({
        message: 'Continue and overwrite only these colliding files?',
        default: false,
      });
      if (!shouldOverwrite) {
        console.log('Migration cancelled.');
        return;
      }
    }
  }

  for (const tool of tools) {
    await mergeDirectory(generatedToolRoot(group, tool), projectPath);
    console.log(`Merged ${TOOL_LAYOUTS[tool].label} format into ${projectPath}`);
  }

  console.log(
    '\nMigration complete. Review git status/diff in the target project before committing.',
  );
}

main().catch((error) => {
  console.error(`\nMigration failed: ${error.message}`);
  process.exitCode = 1;
});
