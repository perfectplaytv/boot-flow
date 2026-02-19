#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import glob from 'glob';

const root = process.cwd();
const forbiddenPatterns = [/api[_-]?key/i, /secret/i, /token/i];
const dependencyAlerts = ['supabase', 'drizzle-orm'];

const log = (message) => console.log(`[agent-security] ${message}`);

async function scanEnvFiles() {
  const files = glob.sync('.env*', { cwd: root, nodir: true });
  const findings = [];
  for (const file of files) {
    const content = await fs.readFile(path.join(root, file), 'utf-8');
    forbiddenPatterns.forEach((pattern) => {
      if (pattern.test(content)) {
        findings.push({ file, pattern: pattern.toString() });
      }
    });
  }
  return findings;
}

async function scanSource() {
  const files = glob.sync('src/**/*.{ts,tsx}', { cwd: root });
  const findings = [];
  for (const file of files) {
    const content = await fs.readFile(path.join(root, file), 'utf-8');
    if (content.includes('supabaseAnonKey') && content.includes('||')) {
      findings.push({ file, issue: 'Supabase chave exposta como fallback.' });
    }
  }
  return findings;
}

async function scanDependencies() {
  const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf-8'));
  const deps = Object.keys(pkg.dependencies ?? {});
  const alerts = deps.filter((dep) => dependencyAlerts.includes(dep));
  return alerts;
}

(async () => {
  log('Iniciando varredura de segurança…');
  const envFindings = await scanEnvFiles();
  const srcFindings = await scanSource();
  const deps = await scanDependencies();

  log(`ENV findings: ${envFindings.length}`);
  log(`Source findings: ${srcFindings.length}`);
  log(`Dependencies monitoradas: ${deps.join(', ') || 'nenhuma'}`);

  const report = {
    generatedAt: new Date().toISOString(),
    envFindings,
    srcFindings,
    dependencyAlerts: deps,
  };

  const outDir = path.join(root, 'logs', 'agent');
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, 'security-scan.json'), JSON.stringify(report, null, 2));

  log('Relatório salvo em logs/agent/security-scan.json');
})();
