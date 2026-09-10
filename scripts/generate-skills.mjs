import { access, cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(__dirname, '..');
export const groupsRoot = path.join(repoRoot, 'skills-group');

export const TOOL_LAYOUTS = Object.freeze({
  codex: { label: 'OpenAI Codex', root: '.agents' },
  cursor: { label: 'Cursor', root: '.cursor' },
  gemini: { label: 'Gemini CLI', root: '.gemini' },
  claude: { label: 'Claude Code', root: '.claude' },
  kiro: { label: 'Kiro', root: '.kiro' },
  copilot: { label: 'GitHub Copilot', root: '.github' },
});

async function isDirectory(target) {
  try {
    return (await stat(target)).isDirectory();
  } catch {
    return false;
  }
}

export async function listSkillGroups() {
  if (!(await isDirectory(groupsRoot))) return [];
  const entries = await readdir(groupsRoot, { withFileTypes: true });
  const groups = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    const groupDir = path.join(groupsRoot, entry.name);
    if (
      (await isDirectory(path.join(groupDir, 'skills'))) &&
      (await isDirectory(path.join(groupDir, 'references')))
    ) {
      groups.push(entry.name);
    }
  }
  return groups.sort();
}

export function normalizeTools(tools) {
  if (!tools || tools.length === 0 || tools.includes('all')) return Object.keys(TOOL_LAYOUTS);
  const unknown = tools.filter((tool) => !(tool in TOOL_LAYOUTS));
  if (unknown.length) throw new Error(`Unsupported tool(s): ${unknown.join(', ')}`);
  return [...new Set(tools)];
}

export function generatedToolRoot(group, tool) {
  return path.join(groupsRoot, group, '.generated', tool);
}

export async function generateSkillGroup(group, tools = ['all']) {
  const groupDir = path.join(groupsRoot, group);
  const skillsDir = path.join(groupDir, 'skills');
  const referencesDir = path.join(groupDir, 'references');

  if (!(await isDirectory(skillsDir)) || !(await isDirectory(referencesDir))) {
    throw new Error(
      `Invalid skill group '${group}'. Expected skills/ and references/ under ${groupDir}`,
    );
  }

  const skillEntries = (await readdir(skillsDir, { withFileTypes: true })).filter(
    (entry) => entry.isDirectory() && !entry.name.startsWith('.'),
  );
  const selectedTools = normalizeTools(tools);
  const outputs = [];

  for (const tool of selectedTools) {
    const layout = TOOL_LAYOUTS[tool];
    const outputRoot = generatedToolRoot(group, tool);
    const agentRoot = path.join(outputRoot, layout.root);
    const generatedSkillsRoot = path.join(agentRoot, 'skills');

    await rm(outputRoot, { recursive: true, force: true });
    await mkdir(generatedSkillsRoot, { recursive: true });

    for (const skillEntry of skillEntries) {
      const sourceSkill = path.join(skillsDir, skillEntry.name);
      const targetSkill = path.join(generatedSkillsRoot, skillEntry.name);
      const sourceSkillFile = path.join(sourceSkill, 'SKILL.md');

      try {
        await access(sourceSkillFile);
      } catch {
        continue;
      }

      await cp(sourceSkill, targetSkill, { recursive: true, force: true });
      await cp(referencesDir, path.join(targetSkill, 'references', '_shared'), {
        recursive: true,
        force: true,
      });

      const generatedSkillFile = path.join(targetSkill, 'SKILL.md');
      const skillContent = await readFile(generatedSkillFile, 'utf8');
      await writeFile(
        generatedSkillFile,
        skillContent.replaceAll('../../references/', './references/_shared/'),
        'utf8',
      );
    }

    outputs.push({ tool, label: layout.label, path: outputRoot, agentRoot });
  }

  return outputs;
}

function parseArgs(argv) {
  const options = { groups: [], tools: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--group' || arg === '-g') options.groups.push(argv[++index]);
    else if (arg === '--tool' || arg === '-t') options.tools.push(argv[++index]);
    else if (arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function printHelp() {
  console.log(`Usage: pnpm generate -- [options]\n\nOptions:\n  -g, --group <name>  Generate one skill group (repeatable)\n  -t, --tool <name>   Generate one AI tool format (repeatable)\n                      Supported: ${Object.keys(TOOL_LAYOUTS).join(', ')}, all\n  -h, --help          Show this help\n\nDefaults: all discovered skill groups and all supported tools.`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) return printHelp();

  const discovered = await listSkillGroups();
  if (discovered.length === 0) throw new Error(`No skill groups found under ${groupsRoot}`);

  const groups = options.groups.length ? options.groups : discovered;
  const missing = groups.filter((group) => !discovered.includes(group));
  if (missing.length) throw new Error(`Unknown skill group(s): ${missing.join(', ')}`);

  const tools = options.tools.length ? options.tools : ['all'];
  for (const group of groups) {
    const outputs = await generateSkillGroup(group, tools);
    console.log(`\n[${group}]`);
    for (const output of outputs) {
      console.log(`  ${output.label.padEnd(16)} -> ${path.relative(repoRoot, output.path)}`);
    }
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    console.error(`\nGenerate failed: ${error.message}`);
    process.exitCode = 1;
  });
}
